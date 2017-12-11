const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const trim = require('../utils/trim')

module.exports = (invoiceNumber, senderName, receiverName, statusDetail, options = {}) => {
  const trimContent = trim(statusDetail)
  if (!trimContent || trimContent === '') {
    throw new ParseError(Message.NOT_FOUND)
  }

  const deliveryCompanyCode = options.deliveryCompanyCode || 'cj'
  const $ = cheerio.load(`<table>${trimContent}</table>`)
  const $row = $('tr:nth-child(odd)')
  const history = []
  if ($row[0]) {
    $row.each((idx, el) => {
      const $columns = $(el).find('td')
      const date = trim($columns.eq(1).text())
      const remark = trim($columns.eq(2).text())
      const location = trim($columns.eq(3).text())
      history.push(new InvoiceHistory(date, location, '', remark, options.format))
    })
  }

  return new Invoice(deliveryCompanyCode, {
    invoiceNumber,
    senderName,
    receiverName,
    history
  })
}
