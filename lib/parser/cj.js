const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const dateRegEx = /([0-9]{4}-[0-9]{2}-[0-9]{2})\n\s+([0-9-]{2}:[0-9-]{2})/ // 배송시간 추출용

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $basicInfoTable = $('.list .listSty1')
  const $deliveryInfoTable = $('.list .listSty2')

  let senderName, receiverName

  // 기본 배송 정보
  if ($basicInfoTable[0]) {
    const $bacicInfo = $basicInfoTable.find('tr td')
    senderName = $bacicInfo.eq(1).text().trim()
    receiverName = $bacicInfo.eq(2).text().trim()
  }

  // 배송 상태 내역
  const history = []
  if ($deliveryInfoTable[0]) {
    $deliveryInfoTable.find('tbody tr').each((idx, el) => {
      const $columns = $(el).find('td')
      const firstField = $columns.eq(0).text().trim()
      if (firstField.indexOf('조회된 데이터가 없습니다') >= 0) {
        throw new ParseError(Message.NOT_FOUND)
      }
      let date
      const dateMatch = dateRegEx.exec(firstField)
      if (dateMatch && dateMatch.length && dateMatch.length >= 2) {
        date = dateMatch[1] + ' ' + dateMatch[2]
      }
      const [location, tel] = ($columns.eq(1).html() || '').split('<br>').map((str) => {
        const afterTrim = str.replace(/\n/g, '').replace(/\s+/g, ' ')
        return $('<div>' + afterTrim + '</div>').text().trim()
      })
      const remark = $columns.eq(2).text().trim().replace(/\t/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ')
      history.push(new InvoiceHistory(date, location, tel, remark, options.format))
    })
  }

  return new Invoice('cj', {
    invoiceNumber,
    senderName,
    receiverName,
    history
  })
}
