const i18n = require('../utils/i18n')
const DeliveryStatus = {
  UNKNOWN: [-1, i18n.STATUS.UNKNOWN],
  WAIT: [10, i18n.STATUS.WAIT],
  HOLDING: [11, i18n.STATUS.HOLDING],
  PICKUP: [20, i18n.STATUS.PICKUP],
  COLLECTED: [30, i18n.STATUS.COLLECTED],
  WORKING_OUT: [40, i18n.STATUS.WORKING_OUT],
  WORKING_IN: [50, i18n.STATUS.WORKING_IN],
  WRONG: [55, i18n.STATUS.WRONG],
  DELIVERY_READY: [60, i18n.STATUS.DELIVERY_READY],
  DELIVERY_MOVE: [65, i18n.STATUS.DELIVERY_MOVE],
  DELIVERED: [70, i18n.STATUS.DELIVERED],
  FAILED: [71, i18n.STATUS.FAILED],
  COMPLETE: [80, i18n.STATUS.COMPLETE]
}

const hasString = (targetString, regexOrText) => {
  return targetString.search(regexOrText) !== -1
}

module.exports = {
  generateStatus: function () {
    let last, remark
    if (this.history) {
      [last] = this.history.slice(-1)
      if (!last) {
        return DeliveryStatus.UNKNOWN
      }
    }

    remark = (last && last.remark) || this.remark
    if (!remark) {
      return DeliveryStatus.UNKNOWN
    }

    const location = (last && last.location) || this.location
    switch (true) {
      case hasString(remark, /대기|미집하|운송장을?\s?발행/):
        return DeliveryStatus.WAIT
      case hasString(remark, /접수|상품을?\s?인수/):
        return DeliveryStatus.PICKUP
      case hasString(remark, '잔류'):
        return DeliveryStatus.HOLDING
      case hasString(remark, /집하|집화/):
        return DeliveryStatus.COLLECTED
      case hasString(remark, /간선\s?상차|간선\s?출고|터미널\s?출고|^발송$|이동중/):
      case hasString(remark, /출발/) && hasString(remark, /배달\s?출발|배송\s?출발/) === false:
        return DeliveryStatus.WORKING_OUT
      case hasString(remark, /간선\s?하차|간선\s?입고|터미널\s?입고|권내\s?하차|입고|도착/):
        return DeliveryStatus.WORKING_IN
      case hasString(remark, '오도착'):
        return DeliveryStatus.WRONG
      case hasString(remark, /배송\s?준비중/):
        return DeliveryStatus.DELIVERY_READY
      case hasString(remark, /배달\s?출발|배달할?\s?예정|배달\s?준비|배송할?\s?예정|배송\s?준비|배송\s?출발|배송\s?출고|발송/):
        return DeliveryStatus.DELIVERY_MOVE
      case hasString(remark, /배달\s?완료|배송\s?완료|경비실에?\s?보관/):
        return DeliveryStatus.DELIVERED
      case hasString(remark, /배달\s?실패|배송\s?실패|미배달/):
        return DeliveryStatus.FAILED
      case hasString(remark, '수령'):
      case location === '고객':
        return DeliveryStatus.COMPLETE
    }
    return DeliveryStatus.UNKNOWN
  },
  generateTel: function (tel) {
    if (tel) {
      return tel.replace(/-/g, '').replace(/\./g, '').replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3')
    }
    return ''
  }
}
