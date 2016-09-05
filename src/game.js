import Deck from './deck'
import Board from './board'
import Stash from './stash'
import Set from './set'

export default class Game {
  constructor () {
    this.deck = new Deck()
    this.board = new Board()
    this.stash = new Stash()

    this.minimalCardAmount = 12
    this.changedCards = []
  }

  start () {
    this.deck.shuffle()
    this.makeBoardValid()

    this.startTime = Date.now()
  }

  deal (n) {
    const cards = this.deck.takeTopCards(n)
    this.changedCards.push(...cards)
    this.board.putCards(cards)
  }

  trySet (cards) {
    if (Set.isSet(cards)) {
      this.stash.putCards(this.board.takeCards(cards))
      this.changedCards.push(...cards)
      if (this.deck.cards.length > 0) {
        this.makeBoardValid()
      } else {
        window.alert(`Finished in ${(Date.now() - this.startTime) / 1000} seconds.`)
      }
    } else {
      console.log('not set')
    }
  }

  makeBoardValid () {
    if (
      this.board.cardCount < this.minimalCardAmount ||
      !Set.hasSet(this.board.conciseCardArray)
    ) {
      this.deal(3)
      this.makeBoardValid()
    }
  }
}
