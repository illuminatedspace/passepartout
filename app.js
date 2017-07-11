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

// current execution order
// Passepartout had been a sort of vagrant in his early years, and now yearned for repose on port 9000.
// request recieived
// jumps left 10
// recording https://www.reddit.com/ in journal
// jumping to url https://www.reddit.com/
// gathering links
// selecting link
//     attempt number 1
//         valid selection
// ~*~*~*~*~*~*newUrl https://www.reddit.com/wiki/
// jumps left 9
// recording https://www.reddit.com/wiki/ in journal
// jumping to url https://www.reddit.com/wiki/
// after jump to https://www.reddit.com/ //<-- happening during request promise? before request promise execution
// gathering links
// selecting link
//     attempt number 1
//         valid selection
// ~*~*~*~*~*~*newUrl https://www.reddit.com/r/gifs/


// TODO: make the journal a linked list instead of an array
  let startingUrl = 'https://www.reddit.com/'
  let journal = []
  let jumps = 25

  travel(startingUrl)

  // TODO: to match pattern from explore, this should be put into it's own function and called on one line here
  function travel (url) {
    explorePromise(url)
    .then((newUrl) => {
      console.log(`recording ${url} in journal`)
      journal.push(url) // log location in journal
      if (!(--jumps)) {
        console.log('maximum jumps reached')
        console.log('sending journal')
        res.send(journal)
      } else {
        travel(newUrl)// if this fails then try again with another link
      }
    })
    .catch((err) => {
      console.log( `sucessfully caught err ${err.code}`)
      if (err.code === 1) {
        jumps += 1
        const backtrackUrl = journal.pop() // grab the link from before the broken one
        console.log(`trying again with backtrack ${backtrackUrl}`)
        if (backtrackUrl) return travel(backtrackUrl)
      }
      console.log('sending journal with error')
      journal.push({code: err.code, message: err.message})
      res.send(journal)
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

      const destinationUrl = randomSelection(selection)

      if (destinationUrl.code === 1) {
        return reject(destinationUrl)
      }

      resolve(destinationUrl)
    })
  })
}

module.exports = app
