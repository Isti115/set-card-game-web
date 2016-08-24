export default class Stash {
  constructor () {
    this.cards = []
  }

  putCard (card) {
    let i = 0
    while (this.cards[i] !== undefined) {i++}
    this.cards[i] = card
  }

  putCards (cards) {
    for (const card of cards) {
      this.putCard(card)
    }
  }
}
