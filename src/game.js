import Deck from './deck'
import Board from './board'

export default class Game {
  constructor () {
    this.deck = new Deck()
    this.board = new Board()
  }

  start () {
    this.deck.shuffle()
    this.deal(12)
  }

  deal (n) {
    this.board.putCards(this.deck.takeCards(n))
  }
}
