const axios = require('axios')
const parser = require('./parser')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('http://www.kglogis.co.kr/delivery/delivery_result.jsp', {
          timeout: TIMEOUT,
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
