const axios = require('axios')
const parser = require('./parser')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const content = await axios.get('https://www.doortodoor.co.kr/m/sub/doortodoor.do', {
          timeout: TIMEOUT,
          params: {
            invc_no: invoiceNumber,
            fsp_action: 'PARC_ACT_002',
            fsp_cmd: 'retrieveInvNoACTM'
          }
        })
        const invoice = parser.cj(invoiceNumber, content.data)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
    })
  }
}
