const axios = require('axios')
const Iconv = require('iconv').Iconv
const parser = require('./parser')
const iconv = new Iconv('euc-kr', 'utf-8//translit//ignore')

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
        const utf8Content = iconv.convert(content.data).toString('utf-8')
        const invoice = parser.hanjin(invoiceNumber, utf8Content)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
