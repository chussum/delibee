const axios = require('axios')
const iconv = require('iconv-lite')
const parser = require('./parser')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('https://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp', {
          timeout: TIMEOUT,
          responseType: 'arraybuffer',
          params: {
            wbl_num: invoiceNumber
          }
        })
        const utf8Content = iconv.decode(content.data, 'EUC-KR').toString()
        const invoice = parser.hanjin(invoiceNumber, utf8Content)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
