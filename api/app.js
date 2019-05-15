const express = require('express')
const redis = require('redis')
const { raw } = require('body-parser')
const app = express()
const port = 3000

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis'
})

const KEY_QUEUE = process.env.KEY_QUEUE || 'queue'


app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', raw(), (req, res) => {
  client.rpush(KEY_QUEUE, req.body, (error, reply) => {
    error && (res.status = 500)
    res.json({ error, reply })
  })
})

app.listen(port, (err) => {
  if (err) {
    throw err
  }
  console.log(`Example app listening on port ${port}!`)
})
