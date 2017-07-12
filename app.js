const express = require('express')
const cheerio = require('cheerio') // jQuery library for the back end
const request = require('request')

const randomSelection = require('./crawl_functions/randomSelection')

const app = express()

// starting url
// TODO: make the get request a post/put so a webpage can be passed in or put it in the req.query

// TODO: make some kind of front end interface that allows for options, a url to be form submitted, and results displayed


// placeholder route to test the server
app.get('/', (req, res, next) => res.send('You\'ve reached Passepartout. I\'m not here right now. Leave your message at the beep!'))

// route to start the crawl
app.get('/crawl', (req, res, next) => {
  console.log('request received')

// TODO: make the journal a linked list instead of an array
  let startingUrl = 'https://www.reddit.com/'
  let journal = []
  let jumps = 300

  travel(startingUrl)
  .catch((err) => {
    console.log('problem with startingUrl')
    console.error(err)
  })

  // TODO: to match pattern from explore, this should be put into it's own function and called on one line here
  function travel (url) {
    return explorePromise(url)
    .then((newUrl) => {
      console.log(`recording ${url} in journal`)
      journal.push(url) // log location in journal
      if (!(--jumps)) {
        console.log('maximum jumps reached')
        console.log('sending journal')
        res.send(journal)
      } else {
        console.log(`jump ${jumps}`)
        return travel(newUrl)// if this fails then try again with another link
      }
    })
    .catch((err) => {
      console.log( `sucessfully caught err ${err.code}`)
      if (err.code !== 2) {
        journal.pop() // throw away the bad link
        jumps += 1
        err.code = 2
        return Promise.reject(err)
      } else {
        return travel(url)
      }
      // console.log(`trying again with backtrack ${backtrackUrl}`)
      // if (backtrackUrl) return travel(backtrackUrl)
      // console.log('sending journal with error')
      // journal.push({code: err.code, message: err.message})
      // res.send(journal)
    })
  }

// promisifying explore
  function explorePromise (url) {
    return new Promise((resolve, reject) => {
      explore(url)
      .then((newUrl) => {
        console.log('~*~*~*~*~*~*newUrl', newUrl)
        return resolve(newUrl)
      })
      .catch((err) => {
        console.log('!!!!!!!PROMISIFIED EXPLORE ERROR', err)
        return reject(err)
      })
    })
  }

  function explore (url) {
    console.log(`jumps left ${jumps}`)

    return requestPromise(url)
    .then(newUrl => { // success handler
      return newUrl
    })
    .catch((err) => {
      console.error('error in explore', err)
      return Promise.reject(err)
      // journal.push({code: err.code, message: err.message})
      // res.send(journal)
    })
  }
})


// promisified request.get
function requestPromise (url) {
  // The structure of our request call
  // The first parameter is our URL
  return new Promise(function (resolve, reject) {
    console.log(`jumping to url ${url}`)
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, (err, response, html) => {
      // First we'll check to make sure no errors occurred when making the request
      if (err){
        return reject(err)
      }

      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      console.log('gathering links')
      var $ = cheerio.load(html);

      // Finally, we'll define the variables we're going to capture
      const selection = $('a') //all the a tags

      //get a random url
      const selectionResult = randomSelection(selection)

      if (selectionResult.code === 1) {
        selectionResult.url = url
        return reject(selectionResult)
      }

      resolve(selectionResult)
    })
  })
}

module.exports = app
