const DeliveryStatus = {
  UNKNOWN: [-1, '알 수 없음'],
  WAIT: [10, '접수 대기'],
  WAITING: [11, '잔류'],
  PICKUP: [20, '접수'],
  COLLECTED: [30, '집하'],
  WORKING_OUT: [40, '배송중(출고)'],
  WORKING_IN: [50, '배송중(입고)'],
  WRONG: [55, '오도착'],
  DELIVERY_READY: [60, '배달준비중'],
  DELIVERY_MOVE: [65, '배달중'],
  DELIVERED: [70, '배달완료'],
  FAILED: [71, '미배달'],
  COMPLETE: [80, '인수확인']
}

const hasString = (targetString, regexOrText) => {
  return targetString.search(regexOrText) !== -1
}

/* istanbul ignore next */
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
        return DeliveryStatus.WAITING
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
      case hasString(remark, /배달\s?완료|배송\s?완료/):
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
