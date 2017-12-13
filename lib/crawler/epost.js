const axios = require('axios')
const parser = require('../parser')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('https://m.epost.go.kr/postal/mobile/mobile.trace.RetrieveDomRigiTraceList.comm', {
          timeout: options.timeout,
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
