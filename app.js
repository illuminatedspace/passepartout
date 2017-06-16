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

app.get('/crawl', (req, res, next) => {
  console.log('request recieived')

  let url = 'https://www.reddit.com/'
  let journal = []
  let jumps = 50

  explore(url)

  function explore (url) {
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
  return new Promise(function (resolve, reject) {
    request(url, (err, response, html) => {
      if (err){
        return reject(err)
      }

      // Utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);

      // grab all the A tags
      const selection = $('a')

      //get a random url
      const destinationUrl = randomSelection(selection, previousJump)

      if (destinationUrl.code === 1) {
        return reject(destinationUrl)
      }

      resolve(destinationUrl)
    })
  })
}

module.exports = app
