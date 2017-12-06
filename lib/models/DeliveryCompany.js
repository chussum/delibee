const DELIVERY_COMPANY_TYPE = require('./DeliveryCompanyType')

module.exports = function (companyCode = '') {
  this.code = companyCode.toUpperCase()
  this.name = DELIVERY_COMPANY_TYPE[this.code]
  /* istanbul ignore next */
  if (!this.name) {
    throw new Error('Unknown Company.')
  }
}
