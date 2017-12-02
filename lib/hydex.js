const axios = require('axios')
const Iconv = require('iconv').Iconv
const parser = require('./parser')
const iconv = new Iconv('euc-kr', 'utf-8//translit//ignore')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('http://www.hydex.net/ehydex/jsp/home/distribution/tracking/tracingView.jsp', {
          timeout: TIMEOUT,
          responseType: 'arraybuffer',
          params: {
            InvNo: invoiceNumber
          }
        })
        const utf8Content = iconv.convert(content.data).toString('utf-8')
        const invoice = parser.hydex(invoiceNumber, utf8Content)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
