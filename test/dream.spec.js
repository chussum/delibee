const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '170050672164'
const content = fs.readFileSync('./test/html/logis.html', 'utf8')

chai.should()

describe('드림택배 (구. KG로지스)', () => {
  const invoice = parser.dream(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('더엑스샵 님')
    invoice.receiverName.should.equal('김** 님')
    invoice.statusCode.should.equal(70)
    invoice.statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 접수', () => {
    history[0].dateTime.should.equal(1511260500000)
    history[0].dateString.should.equal('2017.11.21 19:35')
    history[0].location.should.equal('광주동구')
    history[0].tel.should.equal('010-5555-5316')
    history[0].remark.should.equal('고객님의 상품을 인수하였습니다.')
    history[0].statusCode.should.equal(20)
    history[0].statusText.should.equal('접수')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[1].dateTime.should.equal(1511263980000)
    history[1].dateString.should.equal('2017.11.21 20:33')
    history[1].location.should.equal('광주터미널')
    history[1].tel.should.equal('062-373-0987')
    history[1].remark.should.equal('배달지역으로 상품이 이동중입니다.')
    history[1].statusCode.should.equal(40)
    history[1].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[2].dateTime.should.equal(1511263980000)
    history[2].dateString.should.equal('2017.11.21 20:33')
    history[2].location.should.equal('광주터미널')
    history[2].tel.should.equal('062-373-0987')
    history[2].remark.should.equal('배달지역으로 상품이 이동중입니다.')
    history[2].statusCode.should.equal(40)
    history[2].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[3].dateTime.should.equal(1511285760000)
    history[3].dateString.should.equal('2017.11.22 02:36')
    history[3].location.should.equal('영남터미널')
    history[3].tel.should.equal('001-000-0001')
    history[3].remark.should.equal('배달지역으로 상품이 이동중입니다.')
    history[3].statusCode.should.equal(40)
    history[3].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[4].dateTime.should.equal(1511285940000)
    history[4].dateString.should.equal('2017.11.22 02:39')
    history[4].location.should.equal('영남터미널')
    history[4].tel.should.equal('001-000-0001')
    history[4].remark.should.equal('배달지역으로 상품이 이동중입니다.')
    history[4].statusCode.should.equal(40)
    history[4].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[5].dateTime.should.equal(1511308920000)
    history[5].dateString.should.equal('2017.11.22 09:02')
    history[5].location.should.equal('마산')
    history[5].tel.should.equal('055-266-8848')
    history[5].remark.should.equal('배달지에 고객님의 상품이 도착하였습니다.')
    history[5].statusCode.should.equal(50)
    history[5].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[6].dateTime.should.equal(1511318100000)
    history[6].dateString.should.equal('2017.11.22 11:35')
    history[6].location.should.equal('마산')
    history[6].tel.should.equal('010-8982-3086')
    history[6].remark.should.equal('고객님의 상품을 배달할 예정입니다.')
    history[6].statusCode.should.equal(65)
    history[6].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[7].dateTime.should.equal(1511336280000)
    history[7].dateString.should.equal('2017.11.22 16:38')
    history[7].location.should.equal('마산')
    history[7].tel.should.equal('010-8982-3086')
    history[7].remark.should.equal('고객님의 상품이 배달완료 되었습니다.')
    history[7].statusCode.should.equal(70)
    history[7].statusText.should.equal('배달완료')
  })
})
