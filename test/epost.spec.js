const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '611020165296'
const content = fs.readFileSync('./test/html/epost.html', 'utf8')

chai.should()

describe('우체국택배', () => {
  const invoice = parser.epost(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('디*커버리 물류부')
    invoice.receiverName.should.equal('권*주')
    invoice.statusCode.should.equal(70)
    invoice.statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 집하', () => {
    history[0].dateTime.should.equal(1511405460000)
    history[0].dateString.should.equal('2017.11.23 11:51')
    history[0].location.should.equal('이천우체국')
    history[0].tel.should.equal('031-635-2001')
    history[0].remark.should.equal('집하완료')
    history[0].statusCode.should.equal(30)
    history[0].statusText.should.equal('집하')
  })

  it('InvoiceHistory > 접수', () => {
    history[1].dateTime.should.equal(1511405640000)
    history[1].dateString.should.equal('2017.11.23 11:54')
    history[1].location.should.equal('이천우체국')
    history[1].tel.should.equal('031-635-2001')
    history[1].remark.should.equal('접수')
    history[1].statusCode.should.equal(20)
    history[1].statusText.should.equal('접수')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[2].dateTime.should.equal(1511410620000)
    history[2].dateString.should.equal('2017.11.23 13:17')
    history[2].location.should.equal('이천우체국')
    history[2].tel.should.equal('031-635-2001')
    history[2].remark.should.equal('발송')
    history[2].statusCode.should.equal(40)
    history[2].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[3].dateTime.should.equal(1511413800000)
    history[3].dateString.should.equal('2017.11.23 14:10')
    history[3].location.should.equal('성남우편집중국')
    history[3].tel.should.equal('031-785-0154')
    history[3].remark.should.equal('도착')
    history[3].statusCode.should.equal(50)
    history[3].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[4].dateTime.should.equal(1511454120000)
    history[4].dateString.should.equal('2017.11.24 01:22')
    history[4].location.should.equal('성남우편집중국')
    history[4].tel.should.equal('031-785-0154')
    history[4].remark.should.equal('발송')
    history[4].statusCode.should.equal(40)
    history[4].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[5].dateTime.should.equal(1511456940000)
    history[5].dateString.should.equal('2017.11.24 02:09')
    history[5].location.should.equal('동서울우편집중국')
    history[5].tel.should.equal('02-450-6006')
    history[5].remark.should.equal('도착')
    history[5].statusCode.should.equal(50)
    history[5].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[6].dateTime.should.equal(1511473800000)
    history[6].dateString.should.equal('2017.11.24 06:50')
    history[6].location.should.equal('동서울우편집중국')
    history[6].tel.should.equal('02-450-6006')
    history[6].remark.should.equal('발송')
    history[6].statusCode.should.equal(40)
    history[6].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[7].dateTime.should.equal(1511473860000)
    history[7].dateString.should.equal('2017.11.24 06:51')
    history[7].location.should.equal('동대문우체국')
    history[7].tel.should.equal('02-2210-3703')
    history[7].remark.should.equal('도착')
    history[7].statusCode.should.equal(50)
    history[7].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[8].dateTime.should.equal(1511478960000)
    history[8].dateString.should.equal('2017.11.24 08:16')
    history[8].location.should.equal('동대문우체국')
    history[8].tel.should.equal('02-2210-3703')
    history[8].remark.should.equal('배달준비 집배원:김태성')
    history[8].statusCode.should.equal(65)
    history[8].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[9].dateTime.should.equal(1511486820000)
    history[9].dateString.should.equal('2017.11.24 10:27')
    history[9].location.should.equal('동대문우체국')
    history[9].tel.should.equal('02-2210-3703')
    history[9].remark.should.equal('배달완료 ( 배달 ) (수령인:본인)')
    history[9].statusCode.should.equal(70)
    history[9].statusText.should.equal('배달완료')
  })
})
