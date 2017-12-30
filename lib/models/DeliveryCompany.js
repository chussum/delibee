const i18n = require('../utils/i18n')
const DELIVERY_COMPANY_TYPE = require('./DeliveryCompanyType')

module.exports = function (companyCode = '') {
  this.code = companyCode.toUpperCase()
  this.name = DELIVERY_COMPANY_TYPE[this.code]
  if (!this.name) {
    throw new Error(i18n.UNKWON_COMPANY)
  }
}
