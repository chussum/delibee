module.exports = (options = {}) => {
  const cj = require('./cj')
  return {
    epost: require('./epost')(options),
    lotte: require('./hydex')(options),
    hanjin: require('./hanjin')(options),
    logen: require('./logen')(options),
    logis: require('./logis')(options),
    cj: cj(options),
    cu: cj(Object.assign({ deliveryCompanyCode: 'cu' }, options)),
    cvsnet: cj(Object.assign({ deliveryCompanyCode: 'cu' }, options))
  }
}
