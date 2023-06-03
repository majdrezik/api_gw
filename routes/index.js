const express = require('express')
const router = express.Router()
const axios = require('axios')
const registery = require("./registery.json")
const fs = require('fs')
const loadbalancer = require('../utils/loadbalancer')
var TOKEN


/**
 * enable/disable instances under registery.apiName.instances
 * for testing/maintanance purposes so the api gw doesn't use the instance
 * example:
 
curl -X POST -H 'Content-Type: application/json' -d '{"url":"http://localhost:3004/","enabled":true}' http://localhost:3000/enable-instance/staging 
curl -X POST -H 'Content-Type: application/json' -d '{"url":"http://localhost:3003/","enabled":true}' http://localhost:3000/enable-instance/staging 
 
Now if we curl, we'll have 2 instances ready to serve our requests
-----------------------------------------------
curl curl http://localhost:3000/staging/fakeapi
>     url: http://localhost:3003/
>     url: http://localhost:3004/
*/
router.post('/enable-instance/:apiName', (req, res) => {
  const apiName = req.params.apiName
  const requestBody = req.body
  const instances = registery.services[apiName].instances
  const index = instances.findIndex((srv) => {
    return requestBody.url === srv.url
  })
  if (index == -1) { // if the url we're trying to enable isn't in the registery
    res.send({ status: "error", message: "couldn't find ['" + requestBody.url + "'] for service: " + apiName })
  } else {
    instances[index].enabled = requestBody.enabled
    fs.writeFile(
      './routes/registery.json',
      JSON.stringify(registery),
      (error) => { // callback
        if (error) {
          res.send("could not enable/disable ['" + requestBody.url + "'] for service: " + apiName + "\n" + error)
        } else {
          res.send("successfully enabled/disabled " + registerationInfo.apiName)
        }
      })
  }
})


router.all('/:apiName/:path', (req, res) => {
  const service = registery.services[req.params.apiName]
  if (service) {
    if (!service.loadBalancerStrategy) {
      service.loadBalancerStrategy = "ROUND_ROBIN"
      fs.writeFile(
        './routes/registery.json',
        JSON.stringify(registery),
        (error) => { // callback
          if (error) {
            res.send("could not write loadbalancer strategy")
          }
        })
    }

    // 1. run the loadbalancing function
    // 2. get the ${url} using the newIndex that's returned
    const newIndex = loadbalancer[service.loadBalancerStrategy](service)
    const url = service.instances[newIndex].url // use the url returned by the loadbalancer when we have many services (instances)
    console.log("url: " + url)
    axios({
      method: req.method, // to make it dynamic for all REST requests
      url: url + req.params.path, // the url that's decided by the loadbalancer
      headers: req.headers,
      data: req.body
    }).then((response) => {
      res.send(response.data)
    }).catch(error => {
      res.send("")
    })
  } else {
    res.send("Invalid API request!")
  }
}
)





/*
register: registers a new api configuration in our services JSON
each service will register itself on startup

example:
------------------
curl -X POST -d '{"apiName":"testing","protocol":"http", "host":"localhost", "port":"3001"}' \
-H 'Content-Type: application/json' http://localhost:3000/register
------------------
curl http://localhost:3000/testing_registery/fakeapi
>        TESTING fakeapi micro-service that is running on port 3001%
*/

router.post('/register', (req, res) => {
  const registerationInfo = req.body
  registerationInfo.url = registerationInfo.protocol + "://" + registerationInfo.host + ":" + registerationInfo.port + "/"

  if (apiAlreadyExists(registerationInfo)) {
    //return Already Exists
    res.send("configuration already exists for " + registerationInfo.apiName + " at " + registerationInfo.host + ":" + registerationInfo.port
      + ", no action required.")
  } else {
    /*
      we use push here to create a list of configs instead of 1 object
      so we can scale easily, same service can now scale on different ports
    */
    registery.services[registerationInfo.apiName].instances.push({ ...registerationInfo }) //deconstruction
    fs.writeFile(
      './routes/registery.json',
      JSON.stringify(registery),
      (error) => { // callback
        if (error) {
          res.send("could not register " + registerationInfo.apiName + "\n" + error)
        } else {
          res.send("successfully registered " + registerationInfo.apiName)
        }
      })
  } // end else block
})



/**
 * 
  curl -X POST -d '{"apiName":"staging","url":"http://localhost:3003/"}' \
  -H 'Content-Type: application/json' http://localhost:3000/unregister
 */
router.post('/unregister', (req, res) => {
  const registerationInfo = req.body

  if (apiAlreadyExists(registerationInfo)) {

    const index = registery.services[registerationInfo.apiName].instances.findIndex(instance => {
      return registerationInfo.url === instance.url
    })
    registery.services[registerationInfo.apiName].instances.splice(index, 1)
    fs.writeFile(
      './routes/registery.json',
      JSON.stringify(registery),
      (error) => { // callback
        if (error) {
          res.send("could not unregister " + registerationInfo.apiName + "\n" + error)
        } else {
          res.send("successfully unregistered " + registerationInfo.apiName)
        }
      })
  } else {
    res.send("configuration doesn't exist for " + registerationInfo.apiName + " at " + registerationInfo.url)
  } // end else block
})


/**
 * 
 * @param {*} registerationInfo 
 * @returns boolean
 * 
 * checks wheather the api configuration we're trying to register already exists
 */
const apiAlreadyExists = (registerationInfo) => {
  let exists = false

  registery.services[registerationInfo.apiName].instances.forEach(instance => {
    if (instance.url == registerationInfo.url) {
      exists = true
    }
  });
  return exists

}

module.exports = router






// // generate Token if null and use it as Auth to send to the MS.
// function getToken() {
//   // if (TOKEN === undefined) {
//   if (!isTokenGenerated()) {
//     console.log("isTokenGenerated is false, generate tokens")
//     jsonToken = generateUsersTokens(27)
//   }
//   console.log(jsonToken) // print the users array in object
//   console.log(typeof jsonToken)
//   return jsonToken;
// }

// function getRandomString() {
//   return Math.random().toString(36).substr(2)
// }

// function generateUsersTokens(numOfUsers) {
//   console.log('generating token')
//   var fs = require('fs');
//   var jsonToken = {
//     users: []
//   }
//   for (let i = 1000000; i < 1000000 + numOfUsers; i++)
//     jsonToken.users.push({
//       username: "user-" + i,
//       token: i
//       // token: getRandomString() + getRandomString()
//     })
//   fs.writeFile('creds.json', JSON.stringify(jsonToken), 'utf8', function (err) {
//     if (err) throw err;
//     console.log('saving token completed');
//   });
//   return jsonToken;
// }

// // not working - values are changing on visiting the api
// function isTokenGenerated() {
//   // Check to see if the counter has been initialized
//   if (typeof isTokenGenerated.generatedCounter == 'undefined') {
//     console.log("initializing generating token")
//     isTokenGenerated.generatedCounter = 1; //
//     return false;
//   }
//   return true;
// }