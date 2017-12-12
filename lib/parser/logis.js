const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const i18n = require('../utils/i18n')
const trim = require('../utils/trim')

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $basicInfoTable = $('.input_group .i_table_01')
  if (!$basicInfoTable[0]) {
    throw new ParseError(i18n.NOT_FOUND)
  }

  const $bacicInfo = $basicInfoTable.find('tr td')
  const senderName = trim($bacicInfo.eq(1).text())
  const receiverName = trim($bacicInfo.eq(3).text())

  // 배송 상태 내역
  const $deliveryInfoTable = $('.inquiry_result .c_table_01')
  const history = []
  if ($deliveryInfoTable[0]) {
    const $rows = $deliveryInfoTable.find('tbody tr:not(:last-of-type)')
    if (!$rows[0]) {
      throw new ParseError(i18n.NOT_FOUND)
    }
    $rows.each((idx, el) => {
      const $columns = $(el).find('td')
      const $firstField = $columns.eq(0)
      const ymd = trim($firstField.text())
      const mmhh = trim($columns.eq(1).text())
      const date = ymd + ' ' + mmhh
      const remark = trim($columns.eq(2).text())
      const location = trim($columns.eq(3).text())
      const tel = trim($columns.eq(4).text())
      history.push(new InvoiceHistory(date, location, tel, remark, options.format))
    })
  }

  return new Invoice('logis', {
    invoiceNumber,
    senderName,
    receiverName,
    history
  })
}
