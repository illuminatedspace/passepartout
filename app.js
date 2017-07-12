const cheerio = require('cheerio') // jQuery library functionality in the back end
const request = require('request') // used for making the get requests to websites

const fs = require('fs')

const randomSelection = require('./utilities/randomSelection')


console.log('trip started')

let startingUrl = 'http://www.reddit.com/'
let journal = []
let jumps = 5

embark(startingUrl)
.catch((err) => {
  console.log('problem with startingUrl')
  console.error(err)
})

function embark (url) {
  return explorePromise(url)
  .then((newUrl) => {
    console.log(`recording ${url} in journal`)
    journal.push(url) // log location in journal
    if (!(--jumps)) {
      console.log('maximum jumps reached')
      console.log('writing journal')
      const date = new Date()
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
  .then(newUrl => {
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
    request(url, (err, response, html) => {
      if (err){
        return reject(err)
      }

      console.log('gathering links')
      // cheerio gives us jQuery functionality in backend
      var $ = cheerio.load(html)

      // grab all the a tags
      const selection = $('a')

      // get a random url with utility function
      const selectionResult = randomSelection(selection)

      // if there's a max attempts error reject the promise
      if (selectionResult.code === 1) {
        selectionResult.url = url
        return reject(selectionResult)
      }

      resolve(selectionResult)
    })
  })
}
