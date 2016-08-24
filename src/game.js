import Deck from './deck'
import Board from './board'
import Stash from './stash'
import Set from './set'

export default class Game {
  constructor () {
    this.deck = new Deck()
    this.board = new Board()
    this.stash = new Stash()

    this.changedCards = []
  }

  start () {
    this.deck.shuffle()
  // this.deal(12)
  }

  deal (n) {
    const cards = this.deck.takeTopCards(n)
    this.changedCards = cards
    this.board.putCards(cards)
  }

  trySet (cards) {
    if (Set.isSet(cards)) {
      this.stash.putCards(this.board.takeCards(cards))
      this.changedCards.push(...cards)
    } else {
      console.log('not set')
    }
  }
}
