/*!
 * Copyright(c) 2017 Hyungjoo Kwon
 * MIT Licensed
 */

const DeliveryCompany = require('./lib/models/DeliveryCompany')
const DeliveryCompanyType = require('./lib/models/DeliveryCompanyType')
const i18n = require('./lib/utils/i18n')

module.exports = (options = {}) => {
  i18n.setLocale(options.locale)

  const delibee = require('./lib/crawler')(options)
  return {
    company: async () => {
      return DeliveryCompanyType
    },
    tracking: async (companyCode, invoiceNumber) => {
      try {
        const company = new DeliveryCompany(companyCode)
        const lowerCode = company.code.toLowerCase()
        const invoice = await delibee[lowerCode](invoiceNumber)
        return {
          success: true,
          invoice
        }
      } catch (e) {
        return {
          success: false,
          message: e.message
        }
      }
    }
  }
}
