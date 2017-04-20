export const CardProperty = {
  COLOR: {
    RED: 'red',
    PURPLE: 'purple',
    GREEN: 'green'
  },
  SHAPE: {
    OVAL: 'oval',
    SQUIGGLE: 'squiggle',
    DIAMOND: 'diamond'
  },
  NUMBER: {
    ONE: 'one',
    TWO: 'two',
    THREE: 'three'
  },
  SHADING: {
    SOLID: 'solid',
    STRIPED: 'striped',
    OUTLINE: 'outline'
  }
}

export default class Card {
  constructor (color, shape, number, shading) {
    this.color = color
    this.shape = shape
    this.number = number
    this.shading = shading
  }

  static generateAll () {
    const cards = []

    for (const color in CardProperty.COLOR) {
      for (const shape in CardProperty.SHAPE) {
        for (const number in CardProperty.NUMBER) {
          for (const shading in CardProperty.SHADING) {
            cards.push(new Card(
              CardProperty.COLOR[color],
              CardProperty.SHAPE[shape],
              CardProperty.NUMBER[number],
              CardProperty.SHADING[shading]
            ))
          }
        }
      }
    }

    return cards
  }

  toString () {
    return `${this.color}-${this.shape}-${this.number}-${this.shading}`
  }
}
