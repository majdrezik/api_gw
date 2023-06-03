// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 2002
const axios = require('axios')
app.use(express.json())


const apiName = 'testing'
const host = 'localhost'
const protocol = "http"


// curl -X GET localhost:3000/test_api/fakeapi
app.get('/fakeapi', (req, res, next) => {
  res.send("TESTING fakeapi micro-service that is running on port " + PORT)
})

// curl -X POST localhost:3000/test_api/bogusapi
app.post('/bogusapi', (req, res, next) => {
  res.send("TESTING Bogusapi micro-service that is running on port " + PORT)
})

app.listen(PORT, () => {
  const authString = 'majd:password' // can use basic credentials here cuz this behaves as the front-end
  const encodedAuthString = Buffer.from(authString, 'utf8').toString('base64')
  console.log("encodedAuthString: " + encodedAuthString)
  axios({
    method: 'POST', // to make it dynamic for all REST requests
    url: 'http://localhost:3000/register',
    headers: {
      'Content-Type': 'application/json',
      'authorization': encodedAuthString
    },
    data: {
      apiName: apiName,
      protocol: protocol,
      host: host,
      port: PORT
    }
  }).then((response) => {
    console.log(response.data)
  })
  console.log('testing server started on port ' + PORT)
})

