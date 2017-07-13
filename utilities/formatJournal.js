function formatJournal (journalArray) {
  let journalText = ''
  const journalLength = journalArray.length
  journalArray.forEach((entry, index) => {
    journalText += `${index + 1}: ${entry}`
    if (index < journalLength - 1) { // don't add new line on last entry
      journalText += '\n'
    }
  })
  return journalText
}

// desired format:
// 1: http://www.website.com
// 2: http://www.website.com/page
// etc...

module.exports = formatJournal
