/* istanbul ignore next */
function ParseError (message) {
  this.name = 'ParseError'
  this.message = message
  this.stack = (new Error()).stack
}

ParseError.prototype = new Error()

module.exports = ParseError
