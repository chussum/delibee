const parser = require('../parser')
const chrome = require('../utils/chrome')

module.exports = (options = {}) => {
  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      const browser = chrome.browser
      const page = await browser.newPage()
      try {
        await page.emulate({
          viewport: {
            width: 1400,
            height: 1000,
            isMobile: false
          },
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        })
        await page.setRequestInterception(true)
        page.on('request', (request) => {
          if (request.resourceType === 'image') {
            request.abort()
          } else {
            request.continue()
          }
        })
        page.on('dialog', async (dialog) => {
          const message = dialog.message()
          await dialog.dismiss()
          reject(Error(message))
        })
        await page.goto('https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=' + invoiceNumber, {
          timeout: options.timeout
        })
        const senderNameElement = await page.$('#sendrNm')
        const receiverNameElement = await page.$('#rcvrNm')
        const statusDetailElement = await page.$('#statusDetail')
        const senderName = await (await senderNameElement.getProperty('innerHTML')).jsonValue()
        const receiverName = await (await receiverNameElement.getProperty('innerHTML')).jsonValue()
        const statusDetail = await (await statusDetailElement.getProperty('innerHTML')).jsonValue()
        const invoice = parser.cj(invoiceNumber, senderName, receiverName, statusDetail, options)
        resolve(invoice)
      } catch (e) {
        reject(e)
      }
      await page.close()
    })
  }
}
