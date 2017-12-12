# Delibee

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

<p align="center">
    <img src="docs/img/delibee.png" width="140" alt="delibee" /><br>
    Delivery tracking library on Node.js.
</p> 

## Prerequisites
Node.js >= 7.6

### Required Server Dependencies
Sometimes Delibee use headless chrome. (e.g. CJ대한통운)

#### Debian (e.g. Ubuntu)
> sudo apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

#### CentOS
> sudo yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y


## Issues
Feel free to submit issues and enhancement requests.

## Usage
> npm install delibee

### On Express Framework
```
const express = require('express')
const delibee = require('delibee')({
  timeout: 10000, // default timeout value is '10000'
  locale: 'en' // default locale is 'ko'
})
const app = express()

app.get('/tracking/companies', async (req, res) => {
  const companies = await delibee.company()
  res.send(companies)
})

app.get('/tracking', async (req, res) => {
  const company = req.query.company
  const invoiceNo = req.query.invoice_no
  const invoice = await delibee.tracking(company, invoiceNo)
  res.send(invoice)
})

app.listen(3000)
```
#### Http Request Example
> http://127.0.0.1:3000/tracking?company={delivery_company_code}&invoice_no={invoice_number}

## Delivery Company Code
Company Name | Comapny Code
---- | ----
우체국택배 | EPOST
CJ대한통운 | CJ
한진택배 | HANJIN
롯데택배 (구. 현대택배) | LOTTE
로젠택배 | LOGEN
KG로지스 | LOGIS
CVSnet 편의점택배 | CVSNET
CU 편의점택배 | CU

## Response
Key | Description
---- | ----
deliveryCompany | 택배회사정보
invoiceNumber | 송장번호
senderName | 보낸이
senderAddr | 출발지/주소
receiverName | 받는이
receiverAddr | 도착지/주소
statusCode | 배송상태코드
statusText | 배송상태
history | 배송내역

### DeliveryCompany
Key | Description
---- | ----
code | 택배회사코드
name | 택배회사

### History
Key | Description
---- | ----
dateTime | 시간 (timestamp)
dateString | 시간 (YYYY.MM.DD HH:mm)
location | 위치
tel | 전화번호
remark | 택배사 제공 배송상태
statusCode | 배송상태코드
statusText | 배송상태

### Status
StatusCode | StatusText
---- | ----
-1 | 알수없음
10 | 접수대기
11 | 잔류
20 | 접수
30 | 집하
40 | 배송중(출고)
50 | 배송중(입고)
55 | 오도착
60 | 배달준비중
65 | 배달중
70 | 배달완료
71 | 미배달
80 | 인수확인

### Response Expample 
```
{
  "success": true,
  "invoice": {
    "deliveryCompany": {
      "code": "CJ",
      "name": "CJ대한통운"
    },
    "invoiceNumber": "611020165296",
    "senderName": "-",
    "senderAddr": "",
    "receiverName": "-",
    "receiverAddr": "",
    "history": Array[2][
      {
        "dateTime": 1504700880000,
        "dateString": "2017.09.06 21:28",
        "location": "의정부",
        "tel": "",
        "remark": "물류터미널로 상품이 이동중입니다.",
        "statusCode": 40,
        "statusText": "Department of a shipment"
      },
      {
        "dateTime": 1504781700000,
        "dateString": "2017.09.07 19:55",
        "location": "청원HUB",
        "tel": "",
        "remark": "배송지역으로 상품이 이동중입니다.",
        "statusCode": 40,
        "statusText": "Department of a shipment"
      }
    ],
    "statusCode": 40,
    "statusText": "Department of a shipment"
  }
}
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/flosdor/delibee

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

Contributors
----
Company Name | Contributor
---- | ----
우체국택배 | [@flosdor](https://github.com/flosdor)
CJ대한통운 | [@flosdor](https://github.com/flosdor)
한진택배 | [@flosdor](https://github.com/flosdor)
롯데택배 (구. 현대택배) | [@flosdor](https://github.com/flosdor)
로젠택배 | [@flosdor](https://github.com/flosdor)
KG로지스 | [@flosdor](https://github.com/flosdor)
CVSnet 편의점택배 | [@flosdor](https://github.com/flosdor)
CU 편의점택배 | [@flosdor](https://github.com/flosdor)


## License

[MIT LICENSE](LICENSE)

[npm-image]: https://img.shields.io/npm/v/delibee.svg
[npm-url]: https://npmjs.org/package/delibee
[travis-image]: https://img.shields.io/travis/flosdor/delibee/master.svg
[travis-url]: https://travis-ci.org/flosdor/delibee
[coveralls-image]: https://coveralls.io/repos/github/flosdor/delibee/badge.svg
[coveralls-url]: https://coveralls.io/github/flosdor/delibee
[downloads-image]: https://img.shields.io/npm/dm/delibee.svg
[downloads-url]: https://npmjs.org/package/delibee
