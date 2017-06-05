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
  console.log('request recieived')

// TODO: make the journal a linked list instead of an array
  let startingUrl = 'https://www.reddit.com/'
  let journal = []
  let jumps = 0

  explorePromise(startingUrl)
  .catch(() => {
    console.log('sucessfully caught')
  })

// promisifying explore
  function explorePromise (url) {
    return new Promise ((resolve, reject) => {
      explore(url)
      .then((result) => {
        console.log('~*~*~*~*~*~*RESULT', result)
        resolve(result)
      })
      .catch((err) => {
        console.log('!!!!!!!PROMISIFIED EXPLORE ERROR', err)
        reject(err)
      })
    })
  }

  // trying this workflow that was found here combined with the technique below
  // http://stackoverflow.com/questions/26515671/asynchronous-calls-and-recursion-with-node-js
  function explore (url) {
    console.log(`jumps left ${jumps}`)
    console.log(`recording ${url} in journal`)
    journal.push(url) // log location in journal

    return requestPromise(url)
    .then(newUrl => { // success handler
      return Promise.reject('test')
      // if (!jumps--) {
      //   console.log('maximum jumps reached')
      //   console.log('sending journal')
      //   return journal
      // } else {
      //   console.log('explore newUrl', newUrl)
      //   return {jumps: jumps, journal: journal, url: newUrl}
      // }
    }, (reason) => { // rejection handler if request fails then check to see if the reason was max attempts. if so try again
      console.log('~~~~error', reason.message)
      return Promise.reject(reason)
    })
    // .catch((err) => {
    //   console.error('error in explore', err)
    //   return Promise.reject(err)
    //   // journal.push({code: err.code, message: err.message})
    //   // res.send(journal)
    // })
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
