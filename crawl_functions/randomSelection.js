// for testing
// console.log(selectionValid('wwwreddit.com'))


function randomSelection (selection) {
  console.log('selecting link')
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`    attempt number ${attempt}`)
    const possibleSelection = parseSelection(selection)
    // console.log('possibleSelection in randomSelection', possibleSelection)
    // console.log('type of possible selection', typeof possibleSelection)
    if (selectionValid(possibleSelection)) {
      console.log('        valid selection')
      return possibleSelection
    }
    console.log('        invalid selection')
  }
  console.log('    maximum attempts reached')
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

  // console.log('newSelection in parseSelection', newSelection)
  // console.log('New Selection in randomSelection', newSelection.attribs.href)
  return newSelection ? newSelection.attribs.href : null
}

function selectionValid (url) {
  // console.log('url before if', url)
  if (!url) return false
  // checks to see if the string starts with www., http://, or https://
  if (url.match(/(^(http:\/\/|https:\/\/|www\.))/gm)) {
    // console.log(`is valid: ${url}`)
    return true
  }

  // console.log(`is not valid: ${url}`)
  return false
}

// thought about trying to add the prefix from the last working url
// function historyPrefixAdd (url, lastUrl) {
//   lastUrl.split
// }

module.exports = randomSelection
