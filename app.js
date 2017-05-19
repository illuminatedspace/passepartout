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

  let url = 'https://www.reddit.com/'
  let journal = []
  let jumps = 50

  explore(url)

  // trying this workflow that was found here combined with the technique below
  // http://stackoverflow.com/questions/26515671/asynchronous-calls-and-recursion-with-node-js
  function explore () {
    journal.push(url) // log location in journal

    const previousJump = journal[journal.length - 1]

    requestPromise(url)
    .then(newUrl => {

      if (!jumps--) return res.send(journal)

      else explore(newUrl, previousJump)
    })
    .catch((err) => {
      console.error(err)
      journal.push({code: err.code, message: err.message})
      res.send(journal)
    })
  }
})


function requestPromise (url, previousJump) {
  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  return new Promise(function (resolve, reject) {
    request(url, (err, response, html) => {


      // First we'll check to make sure no errors occurred when making the request
      if (err){
        return reject(err)
      }

      // // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);

      // // Finally, we'll define the variables we're going to capture
      const selection = $('a') //all the a tags

      const destinationUrl = randomSelection(selection, previousJump)

      if (destinationUrl.code === 1) {
        return reject(destinationUrl)
      }

      resolve(destinationUrl)
    })
  })
}

module.exports = app
