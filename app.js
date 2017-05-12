const express = require('express')
const morgan = require('morgan') // logging middleware
const cheerio = require('cheerio') // jQuery library, unsure that I actually need this

const app = express()

// logging middleware for debugging purposes
// TODO: might make using this contigent on a node env variable
// this way it won't run 'in production',
// not sure what production means in terms of a web scraper
app.use(morgan)

// placeholder route to test the server
app.use((req, res, next) => res.send('You\'ve reached Passepartout. I\'m not here right now. Leave a message at the beep!'))

module.exports = app
