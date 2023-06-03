// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 7007
const axios = require('axios')
app.use(express.json())


const apiName = 'prod'
const host = 'localhost'
const protocol = "http"


app.get('/fakeapi', (req, res, next) => {
  res.send("Unauthorized! Go back to Login page")
  // res.send("TESTING fakeapi micro-service that is running on port " + PORT)
})

// app.post('/bogusapi', (req, res, next) => {
//   res.send("TESTING Bogusapi micro-service that is running on port " + PORT)
// })

app.listen(PORT, () => {
  axios({
    method: "POST", // to make it dynamic for all REST requests
    url: "http://localhost:3000/register",
    headers: ('Content-Type: application/json'),
    data: {
      apiName: apiName,
      protocol: protocol,
      host: host,
      port: PORT
    }
  }).then((response) => {
    console.log(response.data)
  })
  console.log('Production server started on port ' + PORT)
})


function authenticateToken(user) {
  //  let _token_ = require('../creds.json');
  console.log("token: " + user.token)
  console.log("username: " + user.username)

  return user.token == user.username.split("-")[1]
  //return _token_ == token // if the token passed from the api gw is the same as the one on the server
}