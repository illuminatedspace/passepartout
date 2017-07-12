// for testing
// console.log(selectionValid('wwwreddit.com'))

const blacklist = ['facebook', 'twitter', 'linkedin', 'apple']


function randomSelection (selection) {
  console.log('selecting link')
  for (let attempt = 1; attempt < selection.length; attempt++) {
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

  return newSelection ? newSelection.attribs.href : null
}

function selectionValid (url) {
  if (!url) return false
  // check for black list sites
  const burned = blacklist.filter((blackSite) => url.includes(blackSite))
  if (burned.length) return false
  // checks to see if the string starts with www., http://, or https://
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
