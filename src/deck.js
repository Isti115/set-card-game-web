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

  pop () {
    return this.cards.pop()
  }
}
