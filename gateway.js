// 1. npm init -y
// 2. npm i -D nodemon
// 3. npm i express axios
// 4. npm run dev - we configured the package.json
// 5. npm install --save helmet (security to our apigw)

const express = require('express')
const app = express()
const helmet = require('helmet')
const PORT = process.env.PORT || 3000
const routes = require('./routes')

app.use(express.json())
app.use(helmet())
app.use('/', routes)

app.listen(PORT, () => {
  console.log('Gateway started on port ' + PORT)
})