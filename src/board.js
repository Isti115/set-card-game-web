export default class Board {
  constructor () {
    this.cards = []
  }

  putCard (card) {
    this.cards.push(card)
  }

  putCards (cards) {
    for (const card of cards) {
      this.putCard(card)
    }
  }
}
