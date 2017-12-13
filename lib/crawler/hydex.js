const axios = require('axios')
const buffer = require('../utils/buffer')
const parser = require('../parser')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('http://www.hydex.net/ehydex/jsp/home/distribution/tracking/tracingView.jsp', {
          timeout: options.timeout,
          responseType: 'arraybuffer',
          params: {
            InvNo: invoiceNumber
          }
        })
        const utf8Content = buffer.decode(content.data)
        const invoice = parser.hydex(invoiceNumber, utf8Content)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
