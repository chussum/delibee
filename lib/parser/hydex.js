const cheerio = require('cheerio')
const Invoice = require('../models/Invoice')
const InvoiceHistory = require('../models/InvoiceHistory')
const ParseError = require('../models/ParseError')
const brnshpInfoRegEx = /BrnshpInfo\('(.+)','(.+)'\)/ // 현재 배송 위치와 전화번호 추출 위해 필요
const pickDlvTelInfoRegEx = /PickDlvTelInfo\('(.+)','(.+)','(.+)'\)/ // 현재 배송 위치와 전화번호 추출 위해 필요
const trim = (str) => str.replace(/\n/g, '').replace(/\s+/g, ' ').trim()

module.exports = (invoiceNumber, content, options = {}) => {
  const $ = cheerio.load(content)
  const $tables = $('table table')
  const $basicInfoTable = $tables.eq(0)
  if (!$basicInfoTable[0]) {
    throw new ParseError('해당 번호에 대한 배송정보가 없습니다.')
  }

  const $bacicInfo = $basicInfoTable.find('tr td')
  const senderAddr = trim($bacicInfo.eq(1).text())
  const receiverAddr = trim($bacicInfo.eq(2).text())

  // 배송 상태 내역
  const $deliveryInfoTable = $tables.eq(1)
  const history = []
  if ($deliveryInfoTable[0]) {
    const $rows = $deliveryInfoTable.find('tbody tr:nth-child(odd)')
    if (!$rows[0]) {
      throw new ParseError('해당 번호에 대한 배송정보가 없습니다.')
    }
    $rows.each((idx, el) => {
      const $columns = $(el).find('td')
      const $firstField = $columns.eq(0)
      const ymd = trim($firstField.text())
      const mmhh = trim($columns.eq(1).text())
      const date = ymd + ' ' + mmhh
      const $location = $columns.eq(2)
      const hrefAttr = $location.find('a').attr('onclick')
      let remark = trim($columns.eq(3).text())
      let location, tel
      let match = brnshpInfoRegEx.exec(hrefAttr)
      match = match || pickDlvTelInfoRegEx.exec(hrefAttr)
      if (match && match.length) {
        location = match[1]
        tel = match.length > 1 ? match[2] : ''
      } else {
        location = $location.text().trim()
      }
      if (idx === 0 && remark === '') {
        remark = '상품을 발송하기 위한 운송장을 발행하였습니다.'
      }
      history.push(new InvoiceHistory(date, location, tel, remark, options.format))
    })
  }

  return new Invoice('lotte', {
    invoiceNumber,
    senderAddr,
    receiverAddr,
    history
  })
}
