const puppeteer = require('puppeteer')
const parser = require('../parser/index')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch()
      try {
        const page = await browser.newPage()
        await page.emulate({
          viewport: {
            width: 1400,
            height: 1000,
            isMobile: false
          },
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        })
        await page.goto('https://www.cjlogistics.com/ko/tool/parcel/tracking', {
          timeout: TIMEOUT
        })
        page.on('dialog', async (dialog) => {
          const message = dialog.message()
          await dialog.dismiss()
          reject(Error(message))
        })
        await page.type('input[name="paramInvcNo"]', invoiceNumber.toString()) // 송장 번호 입력
        const btn = await page.$('input[id="btnSubmit"]') // 검색 버튼 추출
        await btn.click({ delay: 200 }) // 검색 버튼 클릭
        const senderNameElement = await page.$('#sendrNm')
        const receiverNameElement = await page.$('#rcvrNm')
        const statusDetailElement = await page.$('#statusDetail')
        const senderName = await (await senderNameElement.getProperty('innerHTML')).jsonValue()
        const receiverName = await (await receiverNameElement.getProperty('innerHTML')).jsonValue()
        const statusDetail = await (await statusDetailElement.getProperty('innerHTML')).jsonValue()
        const invoice = parser.cj(invoiceNumber, senderName, receiverName, statusDetail, options)
        console.log(invoice)
        await browser.close()
        resolve(invoice)
      } catch (e) {
        await browser.close()
        reject(e)
      }
    })
  }
}
