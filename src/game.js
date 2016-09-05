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
    this.changedCards = {dealt: [], stashed: [], moved: []}
  }

  start () {
    this.deck.shuffle()
    this.makeBoardValid()

    this.startTime = Date.now()
  }

  deal (n) {
    const cards = this.deck.takeTopCards(n)
    this.changedCards.dealt.push(...cards)
    this.board.putCards(cards)
  }

  trySet (cards) {
    if (Set.isSet(cards)) {
      this.stash.putCards(this.board.takeCards(cards))
      this.changedCards.stashed.push(...cards)

      if (this.deck.cards.length > 0) {
        this.makeBoardValid()
      } else {
        window.alert(`Finished in ${(Date.now() - this.startTime) / 1000} seconds.`)
      }

      while (
        this.board.cards.length > this.minimalCardAmount &&
        this.board.cards.slice(0, this.minimalCardAmount).includes(undefined)
      ) {
        console.log(this.board.cards)
        console.log(this.board.cards.slice(0, this.minimalCardAmount).findIndex(c => c === undefined))

        const emptyIndex = this.board.cards.findIndex(c => c === undefined)
        const excessIndex = this.board.cards.length - 1 - this.board.cards
          .slice(this.minimalCardAmount)
          .reverse()
          .findIndex(c => c !== undefined)

        console.log(emptyIndex, excessIndex)

        this.board.cards[emptyIndex] = this.board.cards[excessIndex]
        delete this.board.cards[excessIndex]
        this.changedCards.moved.push(this.board.cards[emptyIndex])
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
