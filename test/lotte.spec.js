const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '170050672164'
const content = fs.readFileSync('./test/html/lotte.html', 'utf8')

chai.should()

describe('롯데택배 (구. 현대택배)', () => {
  const invoice = parser.lotte(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderAddr.should.equal('안양(G)')
    invoice.receiverAddr.should.equal('충주북부(대)')
    invoice.statusCode.should.equal(80)
    invoice.statusText.should.equal('인수확인')
  })

  it('InvoiceHistory > 접수 대기', () => {
    history[0].dateTime.should.equal(1509462000000)
    history[0].dateString.should.equal('2017.11.01 00:00')
    history[0].location.should.equal('안양(G)')
    history[0].tel.should.equal('031-460-7380')
    history[0].remark.should.equal('상품을 발송하기 위한 운송장을 발행하였습니다.')
    history[0].statusCode.should.equal(10)
    history[0].statusText.should.equal('접수 대기')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[1].dateTime.should.equal(1509531000000)
    history[1].dateString.should.equal('2017.11.01 19:10')
    history[1].location.should.equal('군포TML')
    history[1].tel.should.equal('031-460-2800')
    history[1].remark.should.equal('안양1동대리점에서 도착하였습니다.')
    history[1].statusCode.should.equal(50)
    history[1].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[2].dateTime.should.equal(1509531000000)
    history[2].dateString.should.equal('2017.11.01 19:10')
    history[2].location.should.equal('군포TML')
    history[2].tel.should.equal('031-460-2800')
    history[2].remark.should.equal('천안터미널(으)로 출발하였습니다.')
    history[2].statusCode.should.equal(40)
    history[2].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[3].dateTime.should.equal(1509550500000)
    history[3].dateString.should.equal('2017.11.02 00:35')
    history[3].location.should.equal('천안터미널')
    history[3].tel.should.equal('041-565-1058')
    history[3].remark.should.equal('군포TML에서 도착하였습니다.')
    history[3].statusCode.should.equal(50)
    history[3].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[4].dateTime.should.equal(1509550680000)
    history[4].dateString.should.equal('2017.11.02 00:38')
    history[4].location.should.equal('천안터미널')
    history[4].tel.should.equal('041-565-1058')
    history[4].remark.should.equal('충주북부대리점(으)로 출발하였습니다.')
    history[4].statusCode.should.equal(40)
    history[4].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[5].dateTime.should.equal(1509581520000)
    history[5].dateString.should.equal('2017.11.02 09:12')
    history[5].location.should.equal('충주북부대리점')
    history[5].tel.should.equal('043-846-3373')
    history[5].remark.should.equal('천안터미널에서 도착하였습니다.')
    history[5].statusCode.should.equal(50)
    history[5].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달중', () => {
    history[6].dateTime.should.equal(1509587220000)
    history[6].dateString.should.equal('2017.11.02 10:47')
    history[6].location.should.equal('충주북부대리점')
    history[6].tel.should.equal('043-846-3373')
    history[6].remark.should.equal('고객님의 상품을 10시~12시에 배달 예정 입니다. (배송담당: 김찬재 010-5777-9691)')
    history[6].statusCode.should.equal(65)
    history[6].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[7].dateTime.should.equal(1509613320000)
    history[7].dateString.should.equal('2017.11.02 18:02')
    history[7].location.should.equal('충주북부대리점')
    history[7].tel.should.equal('043-846-3373')
    history[7].remark.should.equal('배달 완료하였습니다. (배송담당: 김찬재 010-5777-9691)')
    history[7].statusCode.should.equal(70)
    history[7].statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 인수확인', () => {
    history[8].dateTime.should.equal(1509634740000)
    history[8].dateString.should.equal('2017.11.02 23:59')
    history[8].location.should.equal('고객')
    history[8].tel.should.equal('')
    history[8].remark.should.equal('물품을 받으셨습니다.')
    history[8].statusCode.should.equal(80)
    history[8].statusText.should.equal('인수확인')
  })
})
