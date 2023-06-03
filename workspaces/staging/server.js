// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3003
const axios = require('axios')
app.use(express.json())


const apiName = 'staging'
const host = 'localhost'
const protocol = "http"


// curl -X GET localhost:3000/test_api/fakeapi
app.get('/fakeapi', (req, res, next) => {
  res.send("STAGING fakeapi micro-service that is running on port " + PORT)
})

// curl -X POST localhost:3000/test_api/bogusapi
app.post('/bogusapi', (req, res, next) => {
  res.send("STAGING Bogusapi micro-service that is running on port " + PORT)
})


app.listen(PORT, () => {

  axios({
    method: 'POST', // to make it dynamic for all REST requests
    url: 'http://localhost:3000/register',
    headers: { 'Content-Type': 'application/json' },
    data: {
      apiName: apiName,
      protocol: protocol,
      host: host,
      port: PORT
    }
  }).then((response) => {
    console.log(response.data)
  })

  console.log('staging server started on port ' + PORT)
})

function authenticateToken(user) {
  //  let _token_ = require('../creds.json');
  console.log("token: " + user.token)
  console.log("username: " + user.username)

  return user.token == user.username.split("-")[1]
  //return _token_ == token // if the token passed from the api gw is the same as the one on the server
}