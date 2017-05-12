const http = require('http')

const server = http.createServer()

// when the server gets a request, require in app.js
// this will run all the code in the app.js file
server.on('request', require('./app'))

// create server listening on port 9000
server.listen(9000, () => {
  console.log('Passepartout had been a sort of vagrant in his early years, and now yearned for repose on port 9000.')
})
