// 1) npm init -y
// 2) npm i express

const express = require('express')
const app = express()
const PORT = process.env.PORT || 2222
const axios = require('axios')
app.use(express.json())


const apiName = 'discount'
const host = 'localhost'
const protocol = "http"


// curl -X GET localhost:3000/test_api/fakeapi
app.get('/getDiscount', (req, res, next) => {
  // res.send("Discount micro-service is running on port " + PORT)
  const data = { message: 'Discount micro-service is running on port ' + PORT, status: 200 };
  res.status(200).json(data);
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
      enabled: true
    }
  }).then((response) => {
    console.log(response.data)
  })
  console.log('Discount server started on port ' + PORT)
})

