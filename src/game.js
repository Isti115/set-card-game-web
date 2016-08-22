import Deck from './deck'
import Board from './board'

export default class Game {
  constructor () {
    this.deck = new Deck()
    this.board = new Board()

    this.changedCards = []
  }

  start () {
    this.deck.shuffle()
  // this.deal(12)
  }

  deal (n) {
    const cards = this.deck.takeCards(n)
    this.changedCards = cards
    this.board.putCards(cards)
  }
}
