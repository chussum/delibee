const axios = require('axios')
const parser = require('./parser')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('https://m.epost.go.kr/postal/mobile/mobile.trace.RetrieveDomRigiTraceList.comm', {
          timeout: TIMEOUT,
          params: {
            sid1: invoiceNumber
          }
        })
        const invoice = parser.epost(invoiceNumber, content.data)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
