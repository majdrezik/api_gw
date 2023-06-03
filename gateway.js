// 1. npm init -y
// 2. npm i -D nodemon
// 3. npm i express axios
// middleware express
// 4. npm install --save helmet (security to our apigw)
// 5. npm run dev - we configured the package.json "dev": "nodemon gateway.js",

const registery = require('./routes/registery.json')
const express = require('express')
const app = express()
const helmet = require('helmet')
const PORT = process.env.PORT || 3000
const routes = require('./routes')


// creating a middleware
const auth = (req, res, next) => {
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
  if (authIsToken(authString)) {
    console.log("Authorization is token based")
    // if (req.headers.authorization.toString().toLowerCase().includes("bearer") && req.headers.authorization.toString().toLowerCase() == user.token.toString().toLowerCase()) {
    console.log("Authorized by token!\n")
    next()
    // }
  } else {
    console.log('not token-based authorized...')
    const authParts = authString.split(":") // returns an array
    const username = authParts[0]
    const password = authParts[1]
    console.log("username: " + username + " | password: " + password)

    const indexOfUser = registery.auth.users.findIndex(user => user.username === username)
    const user = registery.auth.users[indexOfUser]
    if (user) { // if user exists

      if (user.username === username && user.password === password) {
        console.log("Authorized by credentials!\n")
        next() // continue to the other parts in the code (routes)
      } else {
        res.send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: Incorrect password' })
      }
    } else {
      res.send({ authenticated: false, path: url, message: ' here Authentication Unsuccessful: User ' + username + ' does not exist' })
    }
  }
}

const authIsToken = (authorization) => {
  const indexOfUser = registery.auth.users.findIndex(user => (authorization.toLowerCase().includes("bearer") && authorization.includes(user.token)))
  return indexOfUser == -1 ? false : true
}


app.use(auth) // use this before the routes
app.use(express.json())
app.use(helmet())
app.use('/', routes)

app.listen(PORT, () => {
  console.log('Gateway started on port ' + PORT)
})