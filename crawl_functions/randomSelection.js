// for testing
// console.log(selectionValid('wwwreddit.com'))


function randomSelection (selection) {
  for (let attempt = selection.length; attempt > 0; attempt--) {
    const possibleSelection = parseSelection(selection)
    if (selectionValid(possibleSelection)) return possibleSelection
  }
  const error = new Error('maximum attempts for vaid link attempted')
  error.message = 'maximum attempts for vaid link attempted'
  error.code = 1
  return error
}

function parseSelection (selection) {
  const selectionLength = selection.length
  const randomNum = Math.random()
  const randomIndex = Math.round(randomNum * (selectionLength - 1))
  const newSelection = selection[randomIndex]

  return newSelection ? newSelection.attribs.href : null
}

function selectionValid (url) {
  if (!url) return false
  if (url.match(/(^(http:\/\/|https:\/\/|www\.))/gm)) {
    return true
  }

  return false
}

// thought about trying to add the prefix from the last working url
// function historyPrefixAdd (url, lastUrl) {
//   lastUrl.split
// }

module.exports = randomSelection
