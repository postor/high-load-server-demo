import http from "k6/http";

let client = 'client' + Math.random()
let num = 1

export default function () {
  http.post("http://192.168.5.43:3009/", JSON.stringify({ client, num }),
    { headers: { "Content-Type": "application/json" } })
  num++
}