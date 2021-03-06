import Deck from './Deck'
import Board from './Board'
import Stash from './Stash'
import Set from './Set'

export default class Game {
  constructor (finished) {
    this.finished = finished

    this.deck = new Deck()
    this.board = new Board()
    this.stash = new Stash()

    this.minimalCardAmount = 12
    this.changedCards = {dealt: [], stashed: [], moved: [], shake: []}

    this.foundSet = []
  }

  reset () {
    this.deck.cards.push(...(this.board.cards.filter(c => c !== undefined)))
    this.deck.cards.push(...this.stash.cards)

    this.board = new Board()
    this.stash = new Stash()
  }

  start () {
    this.deck.shuffle()
    this.makeBoardValid()
  }

  deal (n) {
    const cards = this.deck.takeTopCards(n)
    this.changedCards.dealt.push(...cards)
    this.board.putCards(cards)
  }

  trySet (cards) {
    if (Set.isSet(cards)) {
      cards.sort((a, b) => (a.number.charCodeAt(2) - b.number.charCodeAt(2)))

      this.stash.putCards(this.board.takeCards(cards))
      this.changedCards.stashed.push(...cards)

      this.makeBoardValid()
      this.fillHole()
    } else {
      this.changedCards.shake.push(...cards)
    }
  }

  makeBoardValid () {
    if (
      this.board.cardCount < this.minimalCardAmount ||
      !Set.hasSet(this.board.conciseCardArray, this.foundSet)
    ) {
      if (this.deck.cards.length > 0) {
        this.deal(3)
        this.makeBoardValid()
      } else if (!Set.hasSet(this.board.conciseCardArray, this.foundSet)) {
        this.finished(true)
      }
    }
  }

  fillHole () {
    const emptyIndex = this.board.cards.findIndex(c => c === undefined)
    const excessIndex = this.board.cards.length - 1 - [...this.board.cards]
      .reverse()
      .findIndex(c => c !== undefined)

    if (emptyIndex !== -1 && emptyIndex < excessIndex) {
      this.board.cards[emptyIndex] = this.board.cards[excessIndex]
      delete this.board.cards[excessIndex]
      this.changedCards.moved.push(this.board.cards[emptyIndex])

      this.fillHole()
    }
  }
}
