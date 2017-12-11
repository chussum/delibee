const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const trim = require('../utils/trim')

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $tables = $('table table')
  const $basicInfoTable = $tables.eq(0)
  const $bacicInfo = $basicInfoTable.find('tbody tr:nth-child(even) td:not(.td_02) input')
  if (!$bacicInfo.eq(0).val()) {
    throw new ParseError(Message.NOT_FOUND)
  }
  const senderName = trim($bacicInfo.eq(5).val())
  const receiverName = trim($bacicInfo.eq(7).val())
  const receiverAddr = trim($bacicInfo.eq(8).val())

  // 배송 상태 내역
  const $deliveryInfoTable = $('#gridTrace')
  const history = []
  if ($deliveryInfoTable[0]) {
    $deliveryInfoTable.find('tr').each((idx, el) => {
      const $columns = $(el).find('td')
      const date = trim($columns.eq(0).text())
      if (date === '') {
        return
      }
      const location = trim($columns.eq(1).text())
      const remark = trim($columns.eq(2).text())
      history.push(new InvoiceHistory(date, location, '', remark, options.format))
    })
  }

  return new Invoice('logen', {
    invoiceNumber,
    senderName,
    receiverName,
    receiverAddr,
    history
  })
}
