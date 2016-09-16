export default class Set {
  static isAllEqual (values) {
    return (
      values[0] === values[1] &&
      values[1] === values[2] &&
      values[2] === values[0]
    )
  }

  static isAllDifferent (values) {
    return (
      values[0] !== values[1] &&
      values[1] !== values[2] &&
      values[2] !== values[0]
    )
  }

  static isAllEqualOrDifferent (values) {
    return Set.isAllEqual(values) || Set.isAllDifferent(values)
  }

  static isSet (cards) {
    for (const property in cards[0]) {
      if (!Set.isAllEqualOrDifferent(cards.map(c => c[property]))) {
        return false
      }
    }

    return true
  }

  static hasSet (cards) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          if (this.isSet([i, j, k].map(n => cards[n]))) {
            console.log(i, j, k)
            return true
          }
        }
      }
    }

    return false
  }
}
