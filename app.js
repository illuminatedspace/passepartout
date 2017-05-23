const express = require('express')
const morgan = require('morgan') // logging middleware
const cheerio = require('cheerio') // jQuery library for the back end
const request = require('request')

const crawl = require('./crawl_functions/crawl')
const randomSelection = require('./crawl_functions/randomSelection')

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

// https://www.bennadel.com/blog/3201-exploring-recursive-promises-in-javascript.htm
// https://mostafa-samir.github.io/async-recursive-patterns-pt2/
// http://stackoverflow.com/questions/26515671/asynchronous-calls-and-recursion-with-node-js
// Messing something up in here. Answers are above^^^
app.get('/crawl', (req, res, next) => {
  console.log('request recieived')

  let startingUrl = 'https://www.reddit.com/'
  let journal = []
  let jumps = 10

  explore(startingUrl)

  // trying this workflow that was found here combined with the technique below
  // http://stackoverflow.com/questions/26515671/asynchronous-calls-and-recursion-with-node-js
  function explore (url) {
    let outcome = true;
    console.log(`recording ${url} in journal`)
    journal.push(url) // log location in journal

    requestPromise(url)
    .then(newUrl => { // success handler
      if (!jumps--) {
        console.log('maximum jumps reached')
        console.log('sending journal')
        return res.send(journal)
      } else {
        console.log('explore newUrl', newUrl, explore(newUrl))
        return explore(newUrl)
      }
    }, (reason) => { // rejection handler if request fails then check to see if the reason was max attempts. if so try again
      console.log('~~~~error', reason.message)
      outcome = false
      return Promise.reject(reason)
    })
    .then(result => {console.log(`result of explore after ${url}: ${result}`)}) // starting to think I need to promisify the explore function
    .catch((err) => {
      console.error(err)
      journal.push({code: err.code, message: err.message})
      res.send(journal)
    })
    .then(() => {
      console.log('OUTCOME!!!!!', outcome)
      return outcome
    })
  }
})

// promisified request.get
function requestPromise (url) {
  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  return new Promise(function (resolve, reject) {
    console.log(`jumping to url ${url}`)
    request(url, (err, response, html) => {


      // First we'll check to make sure no errors occurred when making the request
      if (err){
        return reject(err)
      }

      // // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      console.log('gathering links')
      var $ = cheerio.load(html);

      // // Finally, we'll define the variables we're going to capture
      const selection = $('a') //all the a tags

      const destinationUrl = randomSelection(selection)

      if (destinationUrl.code === 1) {
        return reject(destinationUrl)
      }

      resolve(destinationUrl)
    })
  })
}

module.exports = app
