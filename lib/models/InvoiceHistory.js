const moment = require('moment')
const InvoicePrototype = require('./InvoicePrototype')

/**
 * moment
 * @param date
 * @param format
 * @returns {{dateTime: number, dateString: string}}
 */
const toMoment = (str, format) => {
  let formatted = str.replace(/\s+/g, ' ').replace(/\./g, '').replace(/([0-9]{2,4})-([0-9]{2})-([0-9]{2})/g, '$1$2$3')
  if (~str.indexOf('--:--')) { // fixed lotte
    formatted = formatted.replace('--:--', '23:59')
  }
  const dateForMoment = moment(formatted, 'YYYYMMDD HH:mm')
  const dateString = dateForMoment.format(format)
  return {
    moment: dateForMoment,
    dateTime: dateForMoment.valueOf(),
    dateString
  }
}

/**
 * 택배 추적용 모델
 * @param date 날짜
 * @param location 위치
 * @param tel 전화
 * @param remark 주석
 * @param format 날짜 변환 포맷
 * @constructor
 */
function InvoiceHistory (date, location, tel, remark, format = 'YYYY.MM.DD HH:mm') {
  const invoiceDate = toMoment(date, format)
  this.dateTime = invoiceDate.dateTime
  this.dateString = invoiceDate.dateString
  this.location = location || 'Unknown'
  this.tel = this.generateTel(tel)
  this.remark = remark || ''

  const [statusCode, statusText] = this.generateStatus()
  this.statusCode = statusCode
  this.statusText = statusText
}

InvoiceHistory.prototype = InvoicePrototype

module.exports = InvoiceHistory
