const fs = require('fs')
const cheerio = require('cheerio') // jQuery library functionality in the back end
const request = require('request') // used for making the get requests to websites

const randomSelection = require('./utilities/randomSelection')
const formatJournal = require('./utilities/formatJournal')

const startingUrl = 'http://www.reddit.com/'
const journal = []
let jumps = 150

console.log('trip started')
embark(startingUrl)
.catch((err) => {
  console.log('problem with startingUrl')
  console.error(err)
})

function embark (url) {
  console.log(`jumps left ${jumps}`)
  return requestPromise(url)
  .then((newUrl) => {
    console.log(`recording ${url} in journal`)
    journal.push(url) // log location in journal
    if (!(--jumps)) {
      console.log('maximum jumps reached')
      console.log('formatting journal')
      const formattedJournal = formatJournal(journal)
      console.log('writing journal')
      fs.writeFile(`./journals/around-the-web-in-80-days.txt`, formattedJournal, (err) => {
        if (err) console.error(err)
        else console.log('journal published')
      })
    } else {
      console.log('-------------------------')
      return embark(newUrl)
    }
  })
  .catch((err) => {
    console.log( `sucessfully caught err ${err.code}`)
    console.log('-------------------------')
    if (err.code !== 2) {
      journal.pop() // throw away the bad link
      jumps += 1
      err.code = 2
      return Promise.reject(err)
    } else return embark(url)
  })
}

// promisified request.get from request library
function requestPromise (url) {
  return new Promise(function (resolve, reject) {
    console.log(`jumping to url ${url}`)
    request(url, (err, response, html) => {
      if (err) return reject(err)
      console.log('gathering links')
      const $ = cheerio.load(html) // cheerio gives us jQuery functionality in backend
      const selection = $('a') // grab all the a tags
      const selectionResult = randomSelection(selection) // get a random url with utility function
      if (selectionResult.code === 1) { // if max attempts error reject the promise
        selectionResult.url = url
        return reject(selectionResult)
      } else resolve(selectionResult)
    })
  })
}
