const puppeteer = require('puppeteer')
const chrome = {
  puppeteer: puppeteer
}

puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
}).then((browser) => {
  chrome.browser = browser
  chrome.endPoint = browser.wsEndpoint()
  chrome.close = browser.close
})

module.exports = chrome
