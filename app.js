const cheerio = require('cheerio') // jQuery library functionality in the back end
const request = require('request') // used for making the get requests to websites

const fs = require('fs')

const randomSelection = require('./utilities/randomSelection')


console.log('trip started')

// TODO: make the journal a linked list instead of an array
let startingUrl = 'http://www.reddit.com/'
let journal = []
let jumps = 5

embark(startingUrl)
.catch((err) => {
  console.log('problem with startingUrl')
  console.error(err)
})

// TODO: iife function, invoked when file runs
function embark (url) {
  return explorePromise(url)
  .then((newUrl) => {
    console.log(`recording ${url} in journal`)
    journal.push(url) // log location in journal
    if (!(--jumps)) {
      console.log('maximum jumps reached')
      console.log('writing journal')
      const date = new Date()
      // TODO: create dating function to return a correctly formatted date/file name
      fs.writeFile(`./journals/maiden-voyage.json`, journal, () => {console.log('journal published')})
    } else {
      console.log(`jump ${jumps}`)
      return embark(newUrl)
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
      return embark(url)
    }
  })
}
// ()
// ^^^ iife invocation

// TODO: remove this function. It does nothing
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

// TODO: remove this function. It does nothing
function explore (url) {
  console.log(`jumps left ${jumps}`)

  return requestPromise(url)
  .then(newUrl => { // success handler
    return newUrl
  })
  .catch((err) => {
    console.error('error in explore', err)
    return Promise.reject(err)
  })
}

// promisified request.get from request library
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

// module.exports = app
