const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const Message = require('../utils/messages')
const dateRegEx = /([0-9]{4}.[0-9]{2}.[0-9]{2})<span>([0-9-]{2}:[0-9-]{2})<\/span>/ // 배송시간 추출용
const brnshpInfoRegEx = /BrnshpInfo\('(.+)','(.+)'\)/ // 현재 배송 위치와 전화번호 추출 위해 필요
const pickDlvTelInfoRegEx = /PickDlvTelInfo\('(.+)','(.+)','(.+)'\)/ // 현재 배송 위치와 전화번호 추출 위해 필요

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $tables = $('.info_table .view_line')
  const $basicInfoTable = $tables.eq(0)
  const $deliveryInfoTable = $tables.eq(1)

  // 기본 배송 정보
  let senderAddr, receiverAddr
  if ($basicInfoTable[0]) {
    const $bacicInfo = $basicInfoTable.find('tr td')
    const firstField = $bacicInfo.eq(0).text().trim()
    if (firstField.indexOf('배송정보가 없습니다') >= 0) {
      throw new ParseError(Message.NOT_FOUND)
    }
    senderAddr = $bacicInfo.eq(1).text().trim()
    receiverAddr = $bacicInfo.eq(2).text().trim()
  }

  // 배송 상태 내역
  const history = []
  if ($deliveryInfoTable[0]) {
    $deliveryInfoTable.find('tr:not(:first-of-type)').each((idx, el) => {
      const $el = $(el)
      const $location = $el.find('td.center p')
      const hrefAttr = $location.find('a').attr('onclick')
      let location, tel
      let match = brnshpInfoRegEx.exec(hrefAttr)
      match = match || pickDlvTelInfoRegEx.exec(hrefAttr)
      if (match && match.length) {
        location = match[1]
        tel = match.length > 1 ? match[2] : ''
      } else {
        location = $location.text().trim()
      }

      const $deliveryInfoEl = $el.find('td.left p')
      const [date, remark, manager] = ($deliveryInfoEl.html() || '').split('<br>').map((str) => {
        const afterTrim = str.trim()
        const matchDate = dateRegEx.exec(afterTrim)
        if (matchDate) {
          return matchDate[1] + ' ' + matchDate[2]
        }
        return $('<div>' + afterTrim + '</div>').text()
      })
      let description = (remark + (manager ? ' ' + manager : '')).replace(/\t/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ')
      if (idx === 0 && description === '') { // manual remark. because first field is blank.
        description = '상품을 발송하기 위한 운송장을 발행하였습니다.'
      }
      history.push(new InvoiceHistory(date, location, tel, description, options.format))
    })
  }
  return new Invoice('lotte', {
    invoiceNumber,
    senderAddr,
    receiverAddr,
    history
  })
}
