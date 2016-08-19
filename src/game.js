import Deck from './deck'
import Board from './board'

export default class Game {
  constructor (container) {
    this.container = container

    this.deck = new Deck()
    this.board = new Board()
  }

  start () {
    this.container.innerHTML = 'started'
    this.deck.shuffle()
    console.log(this.deck.pop())
  }
}
