const axios = require('axios')
const buffer = require('../utils/buffer')
const parser = require('../parser')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('https://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp', {
          timeout: options.timeout,
          responseType: 'arraybuffer',
          params: {
            wbl_num: invoiceNumber
          }
        })
        const utf8Content = buffer.decode(content.data)
        const invoice = parser.hanjin(invoiceNumber, utf8Content)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
