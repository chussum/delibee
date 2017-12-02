module.exports = (options = {}) => {
  return {
    epost: require('./epost')(options),
    cj: require('./cj')(options),
    lotte: require('./hydex')(options),
    hanjin: require('./hanjin')(options),
    logen: require('./logen')(options),
    logis: require('./logis')(options)
  }
}
