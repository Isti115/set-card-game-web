import { CardProperty } from './card'

const imageSourceFromCardShape = cardShape => ({
  [CardProperty.SHAPE.OVAL]: './images/oval',
  [CardProperty.SHAPE.SQUIGGLE]: './images/squiggle',
  [CardProperty.SHAPE.DIAMOND]: './images/diamond'
}[cardShape])

const symbolCountFromCardNumber = cardNumber => ({
  [CardProperty.NUMBER.ONE]: 1,
  [CardProperty.NUMBER.TWO]: 2,
  [CardProperty.NUMBER.THREE]: 3
}[cardNumber])

const backgroundFromCardShading = (cardShading, color) => ({
  [CardProperty.SHADING.SOLID]: `${color}`,
  [CardProperty.SHADING.STRIPED]: `repeating-linear-gradient(90deg, ${color}, ${color} 3px, white 3px, white 6px)`,
  [CardProperty.SHADING.OUTLINE]: 'white'
}[cardShading])

const elementIdFromCard = card => `card_${card.color}_${card.shape}_${card.number}_${card.shading}`

export default class Renderer {
  constructor (container, game) {
    window.renderer = this

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
    // Render card shaking
    const shakeRight = { payload: [], delay: 50 }
    const shakeLeft = { payload: [], delay: 50 }
    const shakeCenter = { payload: [], delay: 50 }
    for (const card of this.game.changedCards.shake) {
      const currentElement = this.elements[elementIdFromCard(card)]
      const i = this.game.board.cards.indexOf(card)

      shakeRight.payload.push({
        element: currentElement,
        properties: {
          transform: `translateX(${300 + (Math.floor(i / 3)) * 125 + 15}px)` +
            `translateY(${15 + (i % 3) * 175}px)` +
            'rotateY(180deg)',
          transition: 'all 100ms'
        }
      })

      shakeLeft.payload.push({
        element: currentElement,
        properties: {
          transform: `translateX(${300 + (Math.floor(i / 3)) * 125 - 15}px)` +
            `translateY(${15 + (i % 3) * 175}px)` +
            'rotateY(180deg)',
          transition: 'all 100ms'
        }
      })

      shakeCenter.payload.push({
        element: currentElement,
        properties: {
          transform: `translateX(${300 + (Math.floor(i / 3)) * 125}px)` +
            `translateY(${15 + (i % 3) * 175}px)` +
            'rotateY(180deg)',
          transition: 'all 100ms'
        }
      })
    }
    this.game.changedCards.shake = []
    this.queue.push(
      shakeRight, shakeLeft,
      shakeRight, shakeLeft,
      shakeCenter
    )

    // Render card stashing
    for (const card of this.game.changedCards.stashed) {
      const currentElement = this.elements[elementIdFromCard(card)]
      const i = this.game.stash.cards.indexOf(card)

      currentElement.style.zIndex = i

      this.queue.push({
        payload: [{
          element: currentElement,
          properties: {
            transform: `translateX(${15}px)` +
              `translateY(${295 + (i % 3) * 55}px)` +
              `rotateY(${180}deg)` +
              `rotateZ(${90}deg)` +
              `scale(${0.75})`,
            transition: 'all 250ms'
          }
        }],
        delay: 0
      })
    }
    this.game.changedCards.stashed = []

    // Render card dealing
    const dealUp = []
    const dealDown = []
    for (const card of this.game.changedCards.dealt) {
      const currentElement = this.elements[elementIdFromCard(card)]
      const i = this.game.board.cards.indexOf(card)

      dealUp.push({
        payload: [{
          element: currentElement,
          properties: {
            transform: `translateX(${165}px)` +
              `translateY(${190}px)` +
              'rotateY(180deg)' +
              'translateZ(-250px)',
            transition: 'all 400ms'
          }
        }],
        delay: 100
      })

      dealDown.push({
        payload: [{
          element: currentElement,
          properties: {
            transform: `translateX(${300 + (Math.floor(i / 3)) * 125}px)` +
              `translateY(${15 + (i % 3) * 175}px)` +
              'rotateY(180deg)',
            transition: 'all 300ms'
          }
        }],
        delay: 100
      })

      currentElement.style.zIndex = ++this.maxZIndex
    }
    this.game.changedCards.dealt = []
    this.queue.push(...dealUp, { payload: [], delay: 500 }, ...dealDown)

    // Render card moving
    for (const card of this.game.changedCards.moved) {
      const currentElement = this.elements[elementIdFromCard(card)]
      const i = this.game.board.cards.indexOf(card)

      this.queue.push({
        payload: [{
          element: currentElement,
          properties: {
            transform: `translateX(${300 + (Math.floor(i / 3)) * 125}px)` +
              `translateY(${15 + (i % 3) * 175}px)` +
              'rotateY(180deg)',
            transition: 'all 300ms'
          }
        }],
        delay: 100
      })
    }
    this.game.changedCards.moved = []

    this.processQueue()
  }

  processQueue () {
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

    const symbolContainer = document.createElement('div')
    symbolContainer.classList.add('symbolContainer')

    const symbolImagePath = imageSourceFromCardShape(card.shape)

    const symbolOutline = document.createElement('div')
    symbolOutline.classList.add('symbolOutline')

    symbolOutline.style.webkitMaskImage = `url('${symbolImagePath}_outline.png')`
    symbolOutline.style.backgroundColor = card.color

    const symbol = document.createElement('div')
    symbol.classList.add('symbol')

    symbol.style.webkitMaskImage = `url('${symbolImagePath}.png')`

    symbol.style.background = backgroundFromCardShading(card.shading, card.color)

    symbolContainer.appendChild(symbolOutline)
    symbolContainer.appendChild(symbol)

    for (let i = 0; i < symbolCountFromCardNumber(card.number); i++) {
      front.appendChild(symbolContainer.cloneNode(true))
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

    if (this.game.board.cards.includes(card)) {
      const currentElement = this.elements[elementIdFromCard(card)]

      if (this.selectedCards.includes(card)) {
        currentElement.style.transition = 'all 0.15s'
        currentElement.style.boxShadow = 'none'

        this.selectedCards.splice(this.selectedCards.indexOf(card))
      } else {
        currentElement.style.transition = 'all 0.15s'
        currentElement.style.boxShadow = 'aqua 3px 3px 10px 6px'

        this.selectedCards.push(card)

        if (this.selectedCards.length === 3) {
          this.game.trySet(this.selectedCards)
          this.clearSelection()
          this.render()
        }
      }
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
