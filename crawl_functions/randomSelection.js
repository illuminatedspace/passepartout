// TODO: Should make sure link starts with http://. Tries 5 times before quitting.

function randomSelection (selection) {
      const selectionLength = selection.length
      const randomNum = Math.random()
      const randomIndex = Math.round(randomNum * (selectionLength - 1))
      const newSelection = selection[randomIndex]

      console.log(newSelection.attribs.href)
      return newSelection.attribs.href
}

module.exports = randomSelection
