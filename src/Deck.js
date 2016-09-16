import _ from '../node_modules/lodash-es/lodash'
import Card from './Card'

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

  takeTopCard () {
    return this.cards.pop()
  }

  takeTopCards (n) {
    const cards = []

    for (let i = 0; i < n; i++) {
      cards.push(this.takeTopCard())
    }

    return cards
  }
}
