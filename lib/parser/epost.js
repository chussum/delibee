const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const locationAndTelregEx = /(.+)<span.+><br>(.+)<\/span>/ // 현재 배송 위치와 전화번호 추출 위해 필요

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $tables = $('.tb_guide')
  const $basicInfoTable = $tables.eq(1)
  const $deliveryInfoTable = $tables.eq(0)

  if (!$basicInfoTable[0]) {
    throw new ParseError('해당 번호에 대한 배송정보가 없습니다.')
  }

  // 기본 배송 정보
  const $bacicInfo = $basicInfoTable.find('tr td')
  const senderName = $bacicInfo.eq(0).text().trim()
  const receiverName = $bacicInfo.eq(1).text().trim()

  // 배송 상태 내역
  const history = []
  if ($deliveryInfoTable[0]) {
    $deliveryInfoTable.find('tbody tr').each((idx, el) => {
      const $columns = $(el).find('td')
      const firstField = $columns.eq(0).text().trim()
      if (firstField.indexOf('배달정보를 찾지 못했습니다') >= 0) {
        throw new ParseError(Message.NOT_FOUND)
      }
      const ymd = firstField
      const mmss = $columns.eq(1).text().trim()
      const remark = $columns.eq(3).text().trim().replace(/\t/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ')
      const regExMatch = locationAndTelregEx.exec($columns.eq(2).html())
      let location, tel, date
      if (regExMatch && regExMatch.length) {
        location = $('<div>' + regExMatch[1] + '</div>').text()
        tel = regExMatch.length >= 2 ? $('<div>' + regExMatch[2] + '</div>').text() : ''
      } else {
        location = $columns.eq(2).text().trim()
        tel = ''
      }
      date = ymd + (mmss ? ' ' + mmss : '')
      if (date && location && tel && remark) {
        history.push(new InvoiceHistory(date, location, tel, remark, options.format))
      }
    })
  }

  return new Invoice('epost', {
    invoiceNumber,
    senderName,
    receiverName,
    history
  })
}
