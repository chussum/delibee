const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const trim = require('../utils/trim')

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const noDataField = $('.noData')
  const $tables = $('#result_waybill2 table')
  const $basicInfoTable = $tables.eq(0)
  if (noDataField[0] || !$basicInfoTable[0]) {
    throw new ParseError(Message.NOT_FOUND)
  }

  const $bacicInfo = $basicInfoTable.find('tr td')
  const senderName = trim($bacicInfo.eq(3).text())
  const receiverName = trim($bacicInfo.eq(4).text())
  const receiverAddr = trim($bacicInfo.eq(5).text())

  // 배송 상태 내역
  const $deliveryInfoTable = $tables.eq(1)
  const history = []
  if ($deliveryInfoTable[0]) {
    $deliveryInfoTable.find('tbody tr').each((idx, el) => {
      const $columns = $(el).find('td')
      const $firstField = $columns.eq(0)
      if (Number($firstField.attr('colspan')) === 3 && history.length - 1 > 0) {
        const lastHistory = history[history.length - 1]
        const remark = trim($firstField.text())
        history.push(new InvoiceHistory(lastHistory.dateString, lastHistory.location, '', remark, options.format))
      } else {
        const ymd = trim($firstField.text())
        const mmhh = trim($columns.eq(1).text())
        const date = ymd + ' ' + mmhh
        const location = trim($columns.eq(2).text())
        const remark = trim($columns.eq(3).text())
        const tel = trim($columns.eq(4).text())
        history.push(new InvoiceHistory(date, location, tel, remark, options.format))
      }
    })
  }

  return new Invoice('hanjin', {
    invoiceNumber,
    senderName,
    receiverName,
    receiverAddr,
    history
  })
}
