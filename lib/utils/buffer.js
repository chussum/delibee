const iconv = require('iconv-lite')

module.exports = {
  decode: (content, encoding = 'EUC-KR') => {
    return iconv.decode(content, encoding).toString()
  }
}
