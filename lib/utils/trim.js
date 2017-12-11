module.exports = (str = '') => {
  return str.replace(/\n/g, '').replace(/\s+/g, ' ').trim()
}
