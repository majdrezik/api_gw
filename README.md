## Node.js api gateway app with internal loadbalancing for isntances in each service and basic authorization.
### pull the project and get the api gw started by running:
  
    npm run dev
    
### Now navigate to one of the workspaces (behaving as our Frontend) and start them as well (at least one)

    node server.js
    
### right after running the service, the routes/registery.json will be updated with your service.
### In order to enable the service, run:

    curl -X POST -H 'Content-Type: application/json' -d '{"url":"http://localhost:{YOUR_PORT}/","enabled":true}' http://localhost:3000/enable-instance/staging 

### enabling / disabling an instance in a service is done for times such as maintanance, server down, nightly shutdown etc, in those cases, the api gw should not use the instances

### In order to disable the service, run:

    curl -X POST -H 'Content-Type: application/json' -d '{"url":"http://localhost:{YOUR_PORT}/","enabled":false}' http://localhost:3000/enable-instance/staging 

### Notice the change in routes/registery.json file.

### Now if you have many instances under the service. You can enjoy the loadbalancing!

  ### Lets say you have 2 instances enabled under a service in your routes/registery.json file.
  
        {
          "apiName": "staging",
          "protocol": "http",
          "host": "localhost",
          "port": 3003,
          "url": "http://localhost:3003/",
          "enabled": true  <-----------
        },
        {
          "apiName": "staging",
          "protocol": "http",
          "host": "localhost",
          "port": 3004,
          "url": "http://localhost:3004/",
          "enabled": true  <-----------
        }
        
  ### by running the following more than once:
      
      curl http://localhost:3000/staging/fakeapi
      curl http://localhost:3000/staging/fakeapi

### You will have these results - showing the effect of the loadbalancing:
    
    url: http://localhost:3003/
    url: http://localhost:3004/
      
### meaning we're now scaled horizontally and have a loadbalancer
### If you disable one instance from the instances above and re run the `curl` command, you'll only have 1 instance serving.
      
        
        {
          "apiName": "staging",
          "protocol": "http",
          "host": "localhost",
          "port": 3003,
          "url": "http://localhost:3003/",
          "enabled": true  <-----------
        },
        {
          "apiName": "staging",
          "protocol": "http",
          "host": "localhost",
          "port": 3004,
          "url": "http://localhost:3004/",
          "enabled": false  <-----------
        }
        
      ----------------------------------------------
      
      >   curl http://localhost:3000/staging/fakeapi
      >   curl http://localhost:3000/staging/fakeapi
   
      ----------------------------------------------
   
      RESPONSE:
      
     >   url: http://localhost:3003/
     >   url: http://localhost:3003/
 
 ### meaning there's only a single instance running the service
 
