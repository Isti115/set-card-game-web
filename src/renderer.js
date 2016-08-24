import { CardProperty } from './card'

const imageSourceFromCardShape = cardShape => ({
  [CardProperty.SHAPE.OVAL]: './images/oval.png',
  [CardProperty.SHAPE.SQUIGGLE]: './images/squiggle.png',
  [CardProperty.SHAPE.DIAMOND]: './images/diamond.png'
}[cardShape])

const symbolCountFromCardNumber = cardNumber => ({
  [CardProperty.NUMBER.ONE]: 1,
  [CardProperty.NUMBER.TWO]: 2,
  [CardProperty.NUMBER.THREE]: 3
}[cardNumber])

const backgroundFromCardShading = (cardShading, color) => ({
  [CardProperty.SHADING.SOLID]: `${color}`,
  [CardProperty.SHADING.STRIPED]: `repeating-linear-gradient(45deg, ${color}, white 10px)`,
  [CardProperty.SHADING.OUTLINE]: `repeating-linear-gradient(-45deg, ${color}, white 10px)`
}[cardShading])

const elementIdFromCard = card => `card_${card.color}_${card.shape}_${card.number}_${card.shading}`

export default class Renderer {
  constructor (container, game) {
    this.container = container
    this.game = game

    this.boardWidth = 4
    this.boardHeight = 3

    this.elements = {}
    this.maxZIndex = 0

    this.queue = []
    this.autoProcessQueue = true

    this.selectedCards = []
  }

  setContainer (container) {
    this.container = container
  }

  setGame (game) {
    this.game = game
  }

  init () {
    this.elements['deck'] = this.renderDeck()

    for (const card of this.game.deck.cards) {
      this.elements[elementIdFromCard(card)] = this.renderCard(card)
    }

    for (const element in this.elements) {
      this.container.appendChild(this.elements[element])
    }
  }

  render () {
    for (const card of this.game.changedCards) {
      const currentElement = this.elements[elementIdFromCard(card)]
      if (this.game.board.cards.includes(card)) {
        const i = this.game.board.cards.indexOf(card)

        this.queue.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${document.body.clientWidth / 2}px)` +
                `translateY(${document.body.clientHeight / 2}px)` +
                `rotateY(180deg)` +
                `translateZ(-250px)`
            }
          }],
          delay: 1000
        })

        this.queue.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${300 + (Math.floor(i / 3)) * 125}px)` +
                `translateY(${0 + (i % 3) * 175}px)` +
                `rotateY(180deg)`
            }
          }],
          delay: 500
        })
        currentElement.style.zIndex = ++this.maxZIndex
      } else if (this.game.stash.cards.includes(card)) {
        this.queue.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${100}px)` +
                `translateY(${500}px)`,
              transition: 'all 0.25s'
            }
          }],
          delay: 0
        })
      }
    }

    this.game.changedCards = []

    this.processQueue()
  }

  processQueue () {
    console.log(this)
    if (this.queue.length === 0) {
      return false
    }

    const currentQueueItem = this.queue.shift()

    for (const modification of currentQueueItem.payload) {
      for (const property in modification.properties) {
        modification.element.style[property] = modification.properties[property]
      }
    }

    if (this.autoProcessQueue) {
      setTimeout(this.processQueue.bind(this), currentQueueItem.delay)
    }
  }

  renderDeck () {
    const element = document.createElement('div')

    element.id = 'deck'

    return element
  }

  renderCard (card) {
    const element = document.createElement('div')
    element.classList.add('card')

    const back = document.createElement('div')
    back.classList.add('back')

    const front = document.createElement('div')
    front.classList.add('front')

    const symbol = document.createElement('div')
    symbol.classList.add('symbol')

    symbol.style.background = backgroundFromCardShading(card.shading, card.color)

    const symbolImage = document.createElement('img')
    symbolImage.classList.add('symbolImage')

    symbolImage.src = imageSourceFromCardShape(card.shape)

    symbol.appendChild(symbolImage)

    for (let i = 0; i < symbolCountFromCardNumber(card.number); i++) {
      front.appendChild(symbol.cloneNode(true))
    }

    element.appendChild(back)
    element.appendChild(front)

    element.addEventListener('click', (e) => {
      this.cardClicked(card)
    })

    return element
  }

  cardClicked (card) {
    console.log(card)

    const currentElement = this.elements[elementIdFromCard(card)]

    currentElement.style.transition = 'all 0.25s'
    currentElement.style.boxShadow = 'aqua 3px 3px 10px 6px'

    this.selectedCards.push(card)

    if (this.selectedCards.length === 3) {
      this.game.trySet(this.selectedCards)
      this.clearSelection()
      this.render()
    }
  }

  clearSelection () {
    for (const card of this.selectedCards) {
      this.elements[elementIdFromCard(card)].style.boxShadow = ''
    }

    this.selectedCards = []
  }

// getFreeBoardIndices () {
//   const freeIndices = []
//
//   for (let i = 0; i < this.boardWidth * this.boardHeight; i++) {
//     if (board.cards[i] === undefined) {
//       freeIndices.push(i)
//     }
//   }
//
//   return freeIndices
// }
}
