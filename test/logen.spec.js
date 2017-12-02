const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '97083003146'
const content = fs.readFileSync('./test/html/logen.html', 'utf8')

chai.should()

describe('로젠택배', () => {
  const invoice = parser.logen(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('드**')
    invoice.receiverName.should.equal('허**')
    invoice.receiverAddr.should.equal('경기 수원시 권선**')
    invoice.statusCode.should.equal(70)
    invoice.statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 집하', () => {
    history[0].dateTime.should.equal(1510905540000)
    history[0].dateString.should.equal('2017.11.17 16:59')
    history[0].location.should.equal('동용산')
    history[0].tel.should.equal('')
    history[0].remark.should.equal('집하입고')
    history[0].statusCode.should.equal(30)
    history[0].statusText.should.equal('집하')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[1].dateTime.should.equal(1510937100000)
    history[1].dateString.should.equal('2017.11.18 01:45')
    history[1].location.should.equal('이천센터')
    history[1].tel.should.equal('')
    history[1].remark.should.equal('터미널입고')
    history[1].statusCode.should.equal(50)
    history[1].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[2].dateTime.should.equal(1510937400000)
    history[2].dateString.should.equal('2017.11.18 01:50')
    history[2].location.should.equal('이천센터')
    history[2].tel.should.equal('')
    history[2].remark.should.equal('터미널출고')
    history[2].statusCode.should.equal(40)
    history[2].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[3].dateTime.should.equal(1510967160000)
    history[3].dateString.should.equal('2017.11.18 10:06')
    history[3].location.should.equal('서수원')
    history[3].tel.should.equal('')
    history[3].remark.should.equal('배송입고')
    history[3].statusCode.should.equal(50)
    history[3].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[4].dateTime.should.equal(1510970880000)
    history[4].dateString.should.equal('2017.11.18 11:08')
    history[4].location.should.equal('서수원')
    history[4].tel.should.equal('')
    history[4].remark.should.equal('배송출고')
    history[4].statusCode.should.equal(65)
    history[4].statusText.should.equal('배달중')
  })

  it('Invoic5History > 배달중', () => {
    history[5].dateTime.should.equal(1511140800000)
    history[5].dateString.should.equal('2017.11.20 10:20')
    history[5].location.should.equal('서수원')
    history[5].tel.should.equal('')
    history[5].remark.should.equal('배송출고')
    history[5].statusCode.should.equal(65)
    history[5].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[6].dateTime.should.equal(1511167440000)
    history[6].dateString.should.equal('2017.11.20 17:44')
    history[6].location.should.equal('서수원')
    history[6].tel.should.equal('')
    history[6].remark.should.equal('배송완료')
    history[6].statusCode.should.equal(70)
    history[6].statusText.should.equal('배달완료')
  })
})
