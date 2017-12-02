const DELIVERY_COMPANY_TYPE = require('./DeliveryCompanyType')

module.exports = (companyCode = '') => {
  this.code = companyCode.toUpperCase()
  this.name = DELIVERY_COMPANY_TYPE[this.code]
  if (!this.name) {
    throw new Error('Unknown Company.')
  }
}
