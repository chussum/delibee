const puppeteer = require('puppeteer')
const parser = require('./parser')

module.exports = (options = {}) => {
  const TIMEOUT = options.timeout || 10000

  return function (invoiceNumber = '') {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch()
      try {
        const page = await browser.newPage()
        await page.goto('https://www.lotteglogis.com/mobile/goodstrack', {
          timeout: TIMEOUT
        })
        page.on('dialog', async (dialog) => {
          const message = dialog.message()
          await dialog.dismiss()
          reject(Error(message))
        })
        await page.type('input[name="InvNo"]', invoiceNumber.toString()) // 송장 번호 입력
        const btn = await page.$('form[name=form1] a[href="javascript:InputChk_form1();"]') // 검색 버튼 추출
        await Promise.all([
          btn.click(), // 검색 버튼 클릭
          page.waitForNavigation({timeout: TIMEOUT}) // 클릭 후 페이지 전환 완료 될 때까지 기다림
        ])
        await page.waitForNavigation({timeout: TIMEOUT}) // 롯데택배는 한 번 더 페이지 전환
        const content = await page.content() // html 내용 추출
        const invoice = parser.lotte(invoiceNumber, content, options)
        await browser.close()
        resolve(invoice)
      } catch (e) {
        await browser.close()
        reject(e)
      }
    })
  }
}
