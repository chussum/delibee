const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '341129021666'
const content = fs.readFileSync('./test/html/cj.html', 'utf8')

chai.should()

describe('CJ대한통운 / CVSnet 편의점택배 / CU 편의점택배', () => {
  const invoice = parser.cj(trackingCode, '(*', '전*', content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('(*')
    invoice.receiverName.should.equal('전*')
    invoice.statusCode.should.equal(70)
    invoice.statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 접수', () => {
    history[0].dateTime.should.equal(1511343780000)
    history[0].dateString.should.equal('2017.11.22 18:43')
    history[0].location.should.equal('서울뉴길음')
    history[0].tel.should.equal('')
    history[0].remark.should.equal('보내시는 고객님으로부터 상품을 인수받았습니다')
    history[0].statusCode.should.equal(20)
    history[0].statusText.should.equal('접수')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[1].dateTime.should.equal(1511462340000)
    history[1].dateString.should.equal('2017.11.24 03:39')
    history[1].location.should.equal('대전HUB')
    history[1].tel.should.equal('')
    history[1].remark.should.equal('배송지역으로 상품이 이동중입니다.')
    history[1].statusCode.should.equal(40)
    history[1].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[2].dateTime.should.equal(1511484240000)
    history[2].dateString.should.equal('2017.11.24 09:44')
    history[2].location.should.equal('서천Sub')
    history[2].tel.should.equal('')
    history[2].remark.should.equal('고객님의 상품이 배송지에 도착하였습니다.(배송예정:김희석 010-8976-1488)')
    history[2].statusCode.should.equal(50)
    history[2].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[3].dateTime.should.equal(1511494020000)
    history[3].dateString.should.equal('2017.11.24 12:27')
    history[3].location.should.equal('충남서천')
    history[3].tel.should.equal('')
    history[3].remark.should.equal('고객님의 상품을 배송할 예정입니다.(17∼19시)(배송담당:김희석 010-8976-1488)')
    history[3].statusCode.should.equal(65)
    history[3].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[4].dateTime.should.equal(1511513100000)
    history[4].dateString.should.equal('2017.11.24 17:45')
    history[4].location.should.equal('충남서천')
    history[4].tel.should.equal('')
    history[4].remark.should.equal('고객님의 상품이 배송완료 되었습니다.(담당사원:김희석 010-8976-1488)')
    history[4].statusCode.should.equal(70)
    history[4].statusText.should.equal('배달완료')
  })
})
