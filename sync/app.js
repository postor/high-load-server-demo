const { createClient } = require('redis')
const { MongoClient } = require('mongodb')

const KEY_QUEUE = process.env.KEY_QUEUE || 'queue'
const KEY_DB = process.env.KEY_DB || 'report'
const KEY_COLLECTION = process.env.KEY_COLLECTION || 'report'
const BATCH_RECORD_COUNT_LIMIT = 1000
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://redis'
})
  ;
(async () => {
  const mongo = await mongodb()
  const db = mongo.db(KEY_DB)
  const collection = db.collection(KEY_COLLECTION)
  while (true) {
    if (!await singleBatch()) {
      await wait(500)
    }
  }

  async function singleBatch() {
    let list = await dequeue()
    if (list.length) {
      try {
        await insertMany(list)
      } catch (e) {
        console.log(`batch fail! ${new Date()}! ${JSON.stringify(list)}`)
      }
    }
    return list.length
  }

  async function insertMany(list) {
    let toInsert = []
    for (let i = 0; i < list.length; i++) {
      try {
        let obj = JSON.parse(list[i])
        toInsert.push(obj)
      } catch (e) {
        console.log(`fail! ${new Date()}! ${list[i]}`)
      }
    }
    return collection.insertMany(toInsert)
  }

  /**
   * @returns {[]}
   */
  function dequeue() {
    return new Promise((resolve, reject) => {
      redis.multi()
        .lrange(KEY_QUEUE, 0, BATCH_RECORD_COUNT_LIMIT)
        .lrem(KEY_QUEUE, BATCH_RECORD_COUNT_LIMIT)
        .exec((err, data) => {
          if (err) {
            reject(err)
            return
          }
          resolve(data[0])
        })
    })
  }

  async function wait(miliseconds) {
    return Promise((resolve) => {
      setTimeout(() => resolve(), miliseconds)
    })
  }

  /**
   * @returns {Promise<MongoClient>}
   */
  function mongodb() {
    return new Promise((resolve, reject) => {
      // Connect using MongoClient
      MongoClient.connect(process.env.MONGO_URL || 'mongodb://mongodb', function (err, client) {
        if (err) {
          reject(err)
          return
        }
        resolve(client)
      })
    })
  }

})()

