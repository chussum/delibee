const defaultMessages = require('../locales/ko')

module.exports = Object.assign(defaultMessages, {
  setLocale: function (locale = 'ko') {
    try {
      const messages = require('../locales/' + locale)
      for (let property in messages) {
        this[property] = messages[property]
      }
    } catch (e) {
      console.log(e)
    }
  }
})
