const DeliveryCompany = require('./DeliveryCompany')
const InvoicePrototype = require('./InvoicePrototype')

/**
 * 송장 정보
 * @param deliveryCompanyCode 택배사 코드
 * @param invoice 송장 정보
 * @constructor
 */
function Invoice (deliveryCompanyCode, invoice) {
  this.deliveryCompany = new DeliveryCompany(deliveryCompanyCode)
  this.invoiceNumber = invoice.invoiceNumber
  this.senderName = invoice.senderName || ''
  this.senderAddr = invoice.senderAddr || ''
  this.receiverName = invoice.receiverName || ''
  this.receiverAddr = invoice.receiverAddr || ''
  this.history = invoice.history || []

  const [statusCode, statusText] = this.generateStatus()
  this.statusCode = statusCode
  this.statusText = statusText
}

Invoice.prototype = InvoicePrototype

module.exports = Invoice
