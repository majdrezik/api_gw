// 1. npm init -y
// 2. npm i -D nodemon
// 3. npm i express axios
// middleware express
// 4. npm install --save helmet (security to our apigw)
// 5. npm install express jsonwebtoken
// 6. npm run dev - we configured the package.json "dev": "nodemon gateway.js",

const registery = require('./routes/registery.json')
const express = require('express')
const app = express()
const helmet = require('helmet')
const PORT = process.env.PORT || 3000
const routes = require('./routes')
const jwt = require("jsonwebtoken");
const cors = require('cors');

// creating a middleware
const auth = (req, res, next) => {
  const url = req.protocol + "://" + req.hostname + ":" + PORT + req.path

  var authString
  if (req.headers.authorization) {
    authString = Buffer.from(req.headers.authorization, 'base64').toString('utf8')
  } else {
    return res.send("no authorization provided") // Return the response and exit the handler
  }

  if (authIsToken(authString)) {
    console.log("Authorized by token!\n")
    console.log(authString)
    next()
  } else {
    console.log('not token-based authorized...')
    const authParts = authString.split(":")
    const username = authParts[0]
    const password = authParts[1]
    console.log("username: " + username + " | password: " + password)

    const indexOfUser = registery.auth.users.findIndex(user => user.username === username)
    const user = registery.auth.users[indexOfUser]
    if (user) {
      if (user.username === username && user.password === password) {
        console.log("Authorized by credentials!\n")
        next()
      } else {
        return res.status(401).send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: Incorrect password' })
      }
    } else {
      return res.status(401).send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: User ' + username + ' does not exist' })
    }
  }
}


const authIsUserPass = (authString) => {

  if (typeof authString !== 'string') {
    return false;
  }
  // Split the input by colon (:)
  const parts = authString.split(':');
  // Check if the input contains exactly one colon
  if (parts.length !== 2) {
    return false;
  }
  // Trim whitespace from the parts
  const key = parts[0].trim();
  const value = parts[1].trim();
  // Check if the key and value are not empty
  if (key.length === 0 || value.length === 0) {
    return false;
  }
  // Return true if all conditions are met
  return true;
}

const authIsToken = (authorization) => {
  const indexOfUser = registery.auth.users.findIndex(user => (authorization.toLowerCase().includes("bearer") && authorization.includes(user.token)))
  return indexOfUser == -1 ? false : true
}

app.use(cors())
app.use(auth) // use this before the routes
app.use(express.json())
app.use(helmet())

app.use('/', routes)

app.listen(PORT, () => {
  console.log('Gateway started on port ' + PORT)
})