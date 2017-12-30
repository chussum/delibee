const axios = require('axios')
const parser = require('../parser')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('http://www.idreamlogis.com/delivery/delivery_result.jsp', {
          timeout: options.timeout,
          params: {
            item_no: invoiceNumber
          }
        })
        const invoice = parser.dream(invoiceNumber, content.data)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
