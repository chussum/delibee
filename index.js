/*!
 * Copyright(c) 2017 Hyungjoo Kwon
 * MIT Licensed
 */

const DeliveryCompany = require('./lib/models/DeliveryCompany')

module.exports = (options = {}) => {
  return {
    company: async () => {
      return require('./lib/models/DeliveryCompanyType')
    },
    tracking: async (companyCode, invoiceNumber) => {
      try {
        const company = new DeliveryCompany(companyCode)
        const lowerCode = company.code.toLowerCase()
        const invoice = await require('./lib')(options)[lowerCode](invoiceNumber)
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
