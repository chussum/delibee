const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '611020165296'
const content = fs.readFileSync('./test/html/cj.html', 'utf8')

chai.should()

describe('CJ대한통운', () => {
  const invoice = parser.cj(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('(*')
    invoice.receiverName.should.equal('이*')
    invoice.statusCode.should.equal(70)
    invoice.statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 집하', () => {
    history[0].dateTime.should.equal(1504694220000)
    history[0].dateString.should.equal('2017.09.06 19:37')
    history[0].location.should.equal('경기호원')
    history[0].tel.should.equal('')
    history[0].remark.should.equal('집화처리')
    history[0].statusCode.should.equal(30)
    history[0].statusText.should.equal('집하')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[1].dateTime.should.equal(1504781700000)
    history[1].dateString.should.equal('2017.09.07 19:55')
    history[1].location.should.equal('청원HUB')
    history[1].tel.should.equal('')
    history[1].remark.should.equal('간선상차')
    history[1].statusCode.should.equal(40)
    history[1].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[2].dateTime.should.equal(1504838640000)
    history[2].dateString.should.equal('2017.09.08 11:44')
    history[2].location.should.equal('의정부')
    history[2].tel.should.equal('')
    history[2].remark.should.equal('간선하차')
    history[2].statusCode.should.equal(50)
    history[2].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[3].dateTime.should.equal(1504845780000)
    history[3].dateString.should.equal('2017.09.08 13:43')
    history[3].location.should.equal('경기의정부신곡')
    history[3].tel.should.equal('')
    history[3].remark.should.equal('배달출발 (배달예정시간:20∼22시)')
    history[3].statusCode.should.equal(65)
    history[3].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[4].dateTime.should.equal(1504861740000)
    history[4].dateString.should.equal('2017.09.08 18:09')
    history[4].location.should.equal('경기의정부신곡')
    history[4].tel.should.equal('')
    history[4].remark.should.equal('배달완료')
    history[4].statusCode.should.equal(70)
    history[4].statusText.should.equal('배달완료')
  })
})
