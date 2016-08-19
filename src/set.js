export default class Set {
  static isSet (cards) {
    return (
      (cards[0].color === cards[1].color &&
      cards[1].color === cards[2].color &&
      cards[2].color === cards[0].color) ||
      (cards[0].color !== cards[1].color &&
      cards[1].color !== cards[2].color &&
      cards[2].color !== cards[0].color) &&

      (cards[0].shape === cards[1].shape &&
      cards[1].shape === cards[2].shape &&
      cards[2].shape === cards[0].shape) ||
      (cards[0].shape !== cards[1].shape &&
      cards[1].shape !== cards[2].shape &&
      cards[2].shape !== cards[0].shape) &&

      (cards[0].number === cards[1].number &&
      cards[1].number === cards[2].number &&
      cards[2].number === cards[0].number) ||
      (cards[0].number !== cards[1].number &&
      cards[1].number !== cards[2].number &&
      cards[2].number !== cards[0].number) &&

      (cards[0].shading === cards[1].shading &&
      cards[1].shading === cards[2].shading &&
      cards[2].shading === cards[0].shading) ||
      (cards[0].shading !== cards[1].shading &&
      cards[1].shading !== cards[2].shading &&
      cards[2].shading !== cards[0].shading)
    )
  }

  static hasSet () {
    return false
  }
}
