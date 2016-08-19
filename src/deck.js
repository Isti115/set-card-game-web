import _ from '../node_modules/lodash-es/lodash'
import Card from './card'

export default class Deck {
  constructor () {
    this.cards = Card.generateAll()
  }

  shuffle () {
    this.cards = _.shuffle(this.cards)
  }

  isEmpty () {
    return this.cards.length > 0
  }

  takeCard () {
    return this.cards.pop()
  }

  takeCards (n) {
    const cards = []

    for (let i = 0; i < n; i++) {
      cards.push(this.cards.pop())
    }

    return cards
  }
}
