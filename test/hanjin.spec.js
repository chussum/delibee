const fs = require('fs')
const chai = require('chai')
const parser = require('../lib/parser')
const trackingCode = '411810072855'
const content = fs.readFileSync('./test/html/hanjin.html', 'utf8')

chai.should()

describe('한진택배', () => {
  const invoice = parser.hanjin(trackingCode, content)
  const history = invoice.history

  it('Invoice', () => {
    invoice.senderName.should.equal('데***** 님')
    invoice.receiverName.should.equal('장** 님')
    invoice.receiverAddr.should.equal('구미 봉곡')
    invoice.statusCode.should.equal(80)
    invoice.statusText.should.equal('인수확인')
  })

  it('InvoiceHistory > 접수', () => {
    history[0].dateTime.should.equal(1510736820000)
    history[0].dateString.should.equal('2017.11.15 18:07')
    history[0].location.should.equal('용인풍덕(대)')
    history[0].tel.should.equal('031-284-6669')
    history[0].remark.should.equal('고객님 상품을 접수하였습니다.')
    history[0].statusCode.should.equal(20)
    history[0].statusText.should.equal('접수')
  })

  it('InvoiceHistory > 집하', () => {
    history[1].dateTime.should.equal(1510739700000)
    history[1].dateString.should.equal('2017.11.15 18:55')
    history[1].location.should.equal('기흥터미널')
    history[1].tel.should.equal('')
    history[1].remark.should.equal('고객님 상품을 집하하여 기흥터미널에 입고되었습니다.')
    history[1].statusCode.should.equal(30)
    history[1].statusText.should.equal('집하')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[2].dateTime.should.equal(1510739700000)
    history[2].dateString.should.equal('2017.11.15 18:55')
    history[2].location.should.equal('기흥터미널')
    history[2].tel.should.equal('')
    history[2].remark.should.equal('기흥터미널에서 대전B터미널로 이동중 입니다.')
    history[2].statusCode.should.equal(40)
    history[2].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[3].dateTime.should.equal(1510769040000)
    history[3].dateString.should.equal('2017.11.16 03:04')
    history[3].location.should.equal('대전B터미널')
    history[3].tel.should.equal('')
    history[3].remark.should.equal('대전B터미널에 도착하였습니다.')
    history[3].statusCode.should.equal(50)
    history[3].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배송중(출고)', () => {
    history[4].dateTime.should.equal(1510770180000)
    history[4].dateString.should.equal('2017.11.16 03:23')
    history[4].location.should.equal('대전B터미널')
    history[4].tel.should.equal('')
    history[4].remark.should.equal('대전B터미널에서 구미터미널로 이동중 입니다.')
    history[4].statusCode.should.equal(40)
    history[4].statusText.should.equal('배송중(출고)')
  })

  it('InvoiceHistory > 배송중(입고)', () => {
    history[6].dateTime.should.equal(1510790340000)
    history[6].dateString.should.equal('2017.11.16 08:59')
    history[6].location.should.equal('구미터미널')
    history[6].tel.should.equal('')
    history[6].remark.should.equal('구미터미널에 도착하였습니다.')
    history[6].statusCode.should.equal(50)
    history[6].statusText.should.equal('배송중(입고)')
  })

  it('InvoiceHistory > 배달준비중', () => {
    history[5].dateTime.should.equal(1510790340000)
    history[5].dateString.should.equal('2017.11.16 08:59')
    history[5].location.should.equal('구미터미널')
    history[5].tel.should.equal('')
    history[5].remark.should.equal('배송원이 배송준비중 입니다.')
    history[5].statusCode.should.equal(60)
    history[5].statusText.should.equal('배달준비중')
  })

  it('InvoiceHistory > 배달중', () => {
    history[7].dateTime.should.equal(1510795500000)
    history[7].dateString.should.equal('2017.11.16 10:25')
    history[7].location.should.equal('봉곡(대)')
    history[7].tel.should.equal('010-2583-1386')
    history[7].remark.should.equal('배송출발 하였습니다.')
    history[7].statusCode.should.equal(65)
    history[7].statusText.should.equal('배달중')
  })

  it('InvoiceHistory > 배달완료', () => {
    history[8].dateTime.should.equal(1510797600000)
    history[8].dateString.should.equal('2017.11.16 11:00')
    history[8].location.should.equal('봉곡(대)')
    history[8].tel.should.equal('010-2583-1386')
    history[8].remark.should.equal('배송완료 되었습니다.')
    history[8].statusCode.should.equal(70)
    history[8].statusText.should.equal('배달완료')
  })

  it('InvoiceHistory > 인수확인', () => {
    history[9].dateTime.should.equal(1510797600000)
    history[9].dateString.should.equal('2017.11.16 11:00')
    history[9].location.should.equal('봉곡(대)')
    history[9].tel.should.equal('')
    history[9].remark.should.equal('수령인 : 장은*(본인)')
    history[9].statusCode.should.equal(80)
    history[9].statusText.should.equal('인수확인')
  })
})
