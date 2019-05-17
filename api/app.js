const http = require('http')
const redis = require('redis')
const port = 3000

const KEY_QUEUE = process.env.KEY_QUEUE || 'queue'
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis'
}, { useNewUrlParser: true })

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    sendJson(res, { error, reply })
    collectRequestBody(req, body => {
      console.log(body);
      if (!body) {
        return
      }
      client.rpush(KEY_QUEUE, body, (error) => {
        if (error) {
          console.error(`redis fail! restart`)
          process.exit(1)
        }
      })
    })
  } else {
    sendJson(res, { error: 'not json' })
  }
})

server.listen(port, (err) => {
  if (err) {
    throw err
  }
  console.log(`Example app listening on port ${port}!`)
})

function sendJson(res, obj) {
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify(obj))
}

function collectRequestBody(request, callback) {
  const FORM_URLENCODED = 'application/json';
  if (request.headers['content-type']
    && request.headers['content-type'].includes(FORM_URLENCODED)) {
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString()
    })
    request.on('end', () => {
      callback(body)
    })
  }
  else {
    callback(null)
  }
}