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

app.get('/login', (req, res, next) => {

  const url = req.protocol + "://" + req.hostname + ":" + PORT + req.path
  /*  decode the base64 username & password because when they're sent in the header they're encoded
      authString is going to look like this 'majd:password'
      we need to split the result
    */

  const name = req.body.name;
  const password = req.body.password;

  // Make two variable for further use
  let isPresent = false;
  const indexOfUser = registery.auth.users.findIndex(user => user.username === username)
  if (indexOfUser != -1)
    isPresent = true

  if (isPresent) {

    // The jwt.sign method are used
    // to create token
    const token = jwt.sign(registery.auth.users[indexOfUser], "secret");

    // Pass the data or token in response
    res.json({
      login: true,
      token: token,
      data: database[isPresentIndex],
    });
  } else {

    // If isPresent is false return the error
    res.json({
      login: false,
      error: "please check name and password.",
    });
  }
});



app.get('/listUsers', (req, res, next) => {
  res.send("ListUsers api is running on port " + PORT)
})

app.get("/", (req, res) => {
  res.json({
    route: "/",
    authentication: false,
  });
});

app.listen(PORT, () => {

  axios({
    method: 'POST', // to make it dynamic for all REST requests
    url: 'http://localhost:3000/register',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'bWFqZDpwYXNzd29yZA=='//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiU2F0IEp1biAwMyAyMDIzIDE1OjM2OjM1IEdNVCswMzAwIChJc3JhZWwgRGF5bGlnaHQgVGltZSkiLCJ1c2VySWQiOjEyLCJpYXQiOjE2ODU3OTU3OTV9.JJkDUd9NgUzZOlTPTvKk5aSWa_bupDaL8S3Kr2XSpyo'// encodedAuthString
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
