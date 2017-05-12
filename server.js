const http = require('http')

const server = http.createServer()

// when the server gets a request, require in app.js
// this will run all the code in the app.js file
server.on('request', require('./app'))

// create server listening on port 9000
server.listen(9000, () => {
  console.log('You are now free to roam about the port 9000 nation')
})
