const axios = require('axios')
const parser = require('../parser')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('http://www.kglogis.co.kr/delivery/delivery_result.jsp', {
          timeout: options.timeout,
          params: {
            item_no: invoiceNumber
          }
        })
        const invoice = parser.logis(invoiceNumber, content.data)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
