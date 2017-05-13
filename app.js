const express = require('express')
const morgan = require('morgan') // logging middleware
const cheerio = require('cheerio') // jQuery library for the back end
const http = require('http')// might use this instead of request
const request = require('request')

const app = express()

// logging middleware for debugging purposes
// TODO: might make using this contigent on a node env variable
// this way it won't run 'in production',
// not sure what production means in terms of a web scraper
app.use(morgan('dev'))

// starting url
// TODO: make the get request a post/put so a webpage can be passed in or put it in the req.query

// TODO: make some kind of front end interface that allows for options, a url to be form submitted, and results displayed


// placeholder route to test the server
app.get('/', (req, res, next) => res.send('You\'ve reached Passepartout. I\'m not here right now. Leave a message at the beep!'))

app.get('/crawl', (req, res, next) => {
  console.log('request recieived')

  const url = 'http://www.reddit.com';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  request(url, (err, response, html) => {

    // First we'll check to make sure no errors occurred when making the request
    if (err){
      return console.error(err)
    }

    // res.send(response, html)

    // // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
    var $ = cheerio.load(html);

    // // Finally, we'll define the variables we're going to capture

    console.log($('a').length)
  })

})


// app.get('/crawl', (req, res, next) => {
//   console.log('request recieived')

//   // options passed to http request
//   const options = {
//     hostname: 'www.reddit.com/',
//     method: 'GET',
//     agent: false
//   }

//   const request = http.request(options, (response) => {
//     response.setEncoding('utf8')
//     console.log(`request sent to ${options.hostname}`)
//     response.on('data', (chunk) => {
//       console.log(`RESPONSE: ${chunk}`)
//     })

//     response.on('end', () => {
//       console.log('end of response')
//     })

//     response.on('error', (e) => {
//       console.error(`There's been a problem: ${e}`)
//     })

//   // request.write(postData)
//   request.end()
//   res.sendStatus(200)

//   })

// })


module.exports = app
