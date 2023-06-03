// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 1111
const axios = require('axios')
app.use(express.json())


const apiName = 'catalog'
const host = 'localhost'
const protocol = "http"


// curl -X GET localhost:3000/test_api/fakeapi
app.get('/showCatalog', (req, res, next) => {
  // res.send("Catalog micro-service is running on port " + PORT)
  const data = { message: 'Catalog micro-service is running on port ' + PORT, status: 200 };
  res.json(data);
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
      port: PORT,
      enabled: true // enable service by default
    }
  }).then((response) => {
    console.log(response.data)
  })

  console.log('Catalog server started on port ' + PORT)
})

