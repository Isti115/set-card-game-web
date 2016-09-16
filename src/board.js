export default class Board {
  constructor () {
    this.cards = []
  }

  putCard (card) {
    let i = 0
    while (this.cards[i] !== undefined) { i++ }
    this.cards[i] = card
  }

  putCards (cards) {
    for (const card of cards) {
      this.putCard(card)
    }
  }

  takeCard (card) {
    delete this.cards[this.cards.indexOf(card)]
    return card
  }

  takeCards (cards) {
    for (const card of cards) {
      this.takeCard(card)
    }

    return cards
  }

  get conciseCardArray () {
    return this.cards.filter(c => c !== undefined)
  }

  get cardCount () {
    return this.conciseCardArray.length
  }
}
