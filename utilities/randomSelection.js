// for testing
// console.log(selectionValid('wwwreddit.com'))

// sites that should not be jumped to
const blacklist = ['facebook', 'twitter', 'linkedin', 'apple']

function randomSelection (selection) {
  console.log('selecting link')
  for (let attempt = 1; attempt < selection.length; attempt++) {
    console.log(`    attempt number ${attempt}`)
    const possibleSelection = parseSelection(selection)
    if (selectionValid(possibleSelection)) {
      console.log('        valid selection')
      return possibleSelection
    } else console.log('        invalid selection')
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
  // check for blacklisted sites
  const burned = blacklist.filter((blackSite) => url.includes(blackSite))
  if (burned.length) return false
  // checks to see if the string starts with www., http://, or https://
  if (url.match(/(^(http:\/\/|https:\/\/|www\.))/gm)) return true
  else return false
}

module.exports = randomSelection
