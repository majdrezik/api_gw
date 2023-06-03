## Node.js api gateway app with internal loadbalancing for isntances in each service and basic authorization.

![API Gateway](https://github.com/majdrezik/api_gw/assets/39953455/e89c78ed-3c86-401b-ae9b-3b9d6149a7e1)

### pull the project and get the api gw started by running:

    npm run dev

### Now navigate to one of the workspaces (behaving as our Frontend) and start them as well (at least one)

    node server.js

### right after running the service, the routes/registery.json will be updated with your service.

### In order to enable the service, run: (where bWFqZDpwYXNzd29yZA== is base64 encoding of the majd:password as username:password pair)

    curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' -d '{"url":"http://localhost:3003/","enabled":true}' http://localhost:3000/enable-instance/staging

### enabling / disabling an instance in a service is done for times such as maintanance, server down, nightly shutdown etc, in those cases, the api gw should not use the instances

### In order to disable the service, run: (where bWFqZDpwYXNzd29yZA== is base64 encoding of the majd:password as username:password pair)

    curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' -d '{"url":"http://localhost:3003/","enabled":false}' http://localhost:3000/enable-instance/staging

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

      curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' http://localhost:3000/staging/fakeapi
      curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' http://localhost:3000/staging/fakeapi

### You will have these results (in the GW terminal, not the service) - showing the effect of the loadbalancing:

    username: majd | password: password
    Authorized!
    url: http://localhost:3003/  <----------- Notice the port

    username: majd | password: password
    Authorized!
    url: http://localhost:3004/  <----------- Notice the port

### meaning we're now scaled horizontally and have a loadbalancer - we can have the instances on different hosts as well

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

      >   curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' http://localhost:3000/staging/fakeapi
      >  curl -X POST -H 'Content-Type:application/json' -H 'authorization:bWFqZDpwYXNzd29yZA==' http://localhost:3000/staging/fakeapi

      ----------------------------------------------

      RESPONSE:

      username: majd | password: password
      Authorized!
      url: http://localhost:3003/

      username: majd | password: password
      Authorized!
      url: http://localhost:3003/

### meaning there's only a single instance running the service

#
