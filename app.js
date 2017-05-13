const express = require('express')
const morgan = require('morgan') // logging middleware
const cheerio = require('cheerio') // jQuery library for the back end
const http = require('http')// might use this instead of request
const request = require('request')

const crawl = require('./crawl')

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
app.get('/', (req, res, next) => res.send('You\'ve reached Passepartout. I\'m not here right now. Leave your message at the beep!'))

app.get('/crawl', (req, res, next) => {
  console.log('request recieived')

  const url = 'https://www.reddit.com/';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  request(url, (err, response, html) => {
    console.log(`sending request to ${url}`)

    // First we'll check to make sure no errors occurred when making the request
    if (err){
      return console.error(err)
    }

    // // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
    var $ = cheerio.load(html);

    // // Finally, we'll define the variables we're going to capture
    const selection = $('a') //all the a tags

    // TODO: make this into a function that can be called. Should make sure link starts with http://. Tries 5 times before quitting.
    // generates a random selction from a list of all the a tags
    const selectionLength = selection.length
    const randomNum = Math.random()
    const randomIndex = Math.round(randomNum * (selectionLength - 1))
    const randomSelection = selection[randomIndex]

    // TODO: log the domain, .then? navigate to a new domain, start over

    console.log(randomSelection.attribs.href)
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
