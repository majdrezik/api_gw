// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3333
const axios = require('axios')
app.use(express.json())
const registery = require("../../routes/registery.json")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs')

const apiName = 'login'
const host = 'localhost'
const protocol = "http"

// Set up Global configuration access
dotenv.config();

app.get('/signin', (req, res, next) => {

  const url = req.protocol + "://" + req.hostname + ":" + PORT + req.path
  /*  decode the base64 username & password because when they're sent in the header they're encoded
      authString is going to look like this 'majd:password'
      we need to split the result
    */
  var authString
  if (req.headers.authorization) {
    authString = Buffer.from(req.headers.authorization, 'base64').toString('utf8') // from headers, convert the authorization from base 64 to string utf8
  } else {
    res.send("no authorization provided")
  }
  const authParts = authString.split(":") // returns an array
  const username = authParts[0]
  const password = authParts[1]
  console.log("username: " + username + " | password: " + password)



  const indexOfUser = registery.auth.users.findIndex(user => user.username === username)
  if (indexOfUser == -1)
    res.send({ authenticated: false, path: url, message: ' Authentication Unsuccessful: User ' + username + ' does not exist' })
  const user = registery.auth.users[indexOfUser]
  console.log(user)
  if (user) { // if user exists
    console.log(user)
    if (user.username == username && user.password == password) {
      console.log("Authorized!\n")

      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      console.log("secret Key: " + jwtSecretKey)
      let data = {
        time: Date(),
        userId: 12,
      }

      const token = jwt.sign(data, jwtSecretKey);
      registery.auth.users[indexOfUser].token = token //  array of objects [ { "username": {} } , { "username": {} } ]
      console.log('writing token to registery')
      fs.writeFile(
        '../../routes/registery.json',
        JSON.stringify(registery),
        (error) => { // callback
          if (error) {
            res.send("could not write token to user " + req.params.userName)
          }
        })

      next() // continue to the other parts in the code (routes)
    } else {
      res.send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: Incorrect password' })
    }
  } else {
    res.send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: User ' + username + ' does not exist' })
  }

})

app.get('/listUsers', (req, res, next) => {
  res.send("ListUsers api is running on port " + PORT)
})


app.listen(PORT, () => {

  axios({
    method: 'POST', // to make it dynamic for all REST requests
    url: 'http://localhost:3000/register',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'QmVhcmVyIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowYVcxbElqb2lVMkYwSUVwMWJpQXdNeUF5TURJeklERXlPakV6T2pNMklFZE5WQ3N3TXpBd0lDaEpjM0poWld3Z1JHRjViR2xuYUhRZ1ZHbHRaU2tpTENKMWMyVnlTV1FpT2pFeUxDSnBZWFFpT2pFMk9EVTNPRE0yTVRaOS5XMDh6WTIzWXBaZmpZcG1hOW5qc3otQ2V5ZF9DX1ozLVRMLUQwZC03ZktZ'//encodedAuthString
    },
    data: {
      apiName: apiName,
      protocol: protocol,
      host: host,
      port: PORT,
      enabled: true
    }
  }).then((response) => {
    console.log(response.data)
  })
  console.log('Login server started on port ' + PORT)
})







  //   axios({
//     method: 'POST', // to make it dynamic for all REST requests
//     url: 'http://localhost:3000/register',
//     headers: {
//       'Content-Type': 'application/json',
//       // 'authorization': 'QmVhcmVyIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowYVcxbElqb2lVMkYwSUVwMWJpQXdNeUF5TURJeklERXlPakV6T2pNMklFZE5WQ3N3TXpBd0lDaEpjM0poWld3Z1JHRjViR2xuYUhRZ1ZHbHRaU2tpTENKMWMyVnlTV1FpT2pFeUxDSnBZWFFpT2pFMk9EVTNPRE0yTVRaOS5XMDh6WTIzWXBaZmpZcG1hOW5qc3otQ2V5ZF9DX1ozLVRMLUQwZC03ZktZ'//encodedAuthString
//     },
//     data: {
//       apiName: apiName,
//       protocol: protocol,
//       host: host,
//       port: PORT,
//       enabled: true
//     }
//   }).then((response) => {
//     console.log(response.data)
//   })
//   console.log('Login server started on port ' + PORT)
// })
