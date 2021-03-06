import { CardProperty } from './Card'

const imageSourceFromCardShape = cardShape => ({
  [CardProperty.SHAPE.OVAL]: './images/shapes/oval',
  [CardProperty.SHAPE.SQUIGGLE]: './images/shapes/squiggle',
  [CardProperty.SHAPE.DIAMOND]: './images/shapes/diamond'
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
  constructor (containerParent, game) {
    this.containerParent = containerParent
    this.container = document.createElement('div')
    this.container.id = 'gameContainer'
    this.containerParent.appendChild(this.container)

    this.game = game

    this.boardHeight = 3

    this.elements = {}
    this.maxZIndex = 0

    this.queue = []
    this.autoProcessQueue = true

    this.selectedCards = []

    this.boardTop = -40
    this.boardLeft = 300
  }

  setContainer (container) {
    this.container = container
  }

  setGame (game) {
    this.game = game
  }

  init () {
    this.elements['deck'] = document.createElement('div')
    this.elements['deck'].id = 'deck'

    this.elements['deckCounter'] = document.createElement('div')
    this.elements['deckCounter'].id = 'deckCounter'
    this.updateDeckCounterText()

    this.elements['timer'] = document.createElement('div')
    this.elements['timer'].id = 'timer'

    this.elements['stashCounter'] = document.createElement('div')
    this.elements['stashCounter'].id = 'stashCounter'

    for (const card of this.game.deck.cards) {
      this.elements[elementIdFromCard(card)] = this.renderCard(card)
    }

    for (const element in this.elements) {
      this.container.appendChild(this.elements[element])
    }
  }

  reset () {
    this.queue = []
    clearTimeout(this.queueTimeout)

    this.selectedCards = []

    this.elements['stashCounter'].innerHTML = ''

    for (const card of this.game.deck.cards) {
      this.elements[elementIdFromCard(card)].style.transform = ''
      this.elements[elementIdFromCard(card)].style.zIndex = -1
      this.elements[elementIdFromCard(card)].classList.remove('selected')
    }
  }

  positionFromIndex (i) {
    return {
      x: i < 15
        ? this.boardLeft + (Math.floor(i / this.boardHeight)) * 125
        : this.boardLeft - (Math.floor((i - 12) / this.boardHeight)) * 125,
      y: this.boardTop + (i % this.boardHeight) * 170
    }
  }

  updateDeckCounterText () {
    this.elements['deckCounter'].innerHTML = this.game.deck.cards.length > 0
      ? `Remaining: ${this.game.deck.cards.length}`
      : `Deck is empty`
  }

  render () {
    // Render card stashing
    if (this.game.changedCards.stashed.length > 0) {
      for (const card of this.game.changedCards.stashed) {
        const currentElement = this.elements[elementIdFromCard(card)]
        const i = this.game.stash.cards.indexOf(card)

        currentElement.style.zIndex = i

        this.queue.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${10}px)` +
                `translateY(${235 + (i % this.boardHeight) * 50}px)` +
                `rotateY(${180}deg)` +
                `rotateZ(${90}deg)` +
                `scale(${0.7})`,
              transition: 'transform 250ms'
            }
          }],
          delay: 0
        })
      }
      this.game.changedCards.stashed = []

      this.elements['stashCounter'].innerHTML =
        `Found: ${this.game.stash.cards.length / 3} set${this.game.stash.cards.length > 3 ? 's' : ''}`
    }

    // Render card dealing
    if (this.game.changedCards.dealt.length > 0) {
      const dealUp = []
      const dealDown = []
      for (const card of this.game.changedCards.dealt) {
        const currentElement = this.elements[elementIdFromCard(card)]
        currentElement.style.zIndex = ++this.maxZIndex
        const i = this.game.board.cards.indexOf(card)
        const position = this.positionFromIndex(i)

        dealUp.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${165}px)` +
                `translateY(${190}px)` +
                'rotateY(180deg)' +
                `translateZ(${-250}px)`,
              transition: 'transform 400ms'
            }
          }],
          delay: 100
        })

        dealDown.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${position.x}px)` +
                `translateY(${position.y}px)` +
                'rotateY(180deg)',
              transition: 'transform 300ms'
            }
          }],
          delay: 100
        })
      }
      this.game.changedCards.dealt = []
      this.queue.push(...dealUp, { payload: [], delay: 500 }, ...dealDown)

      this.updateDeckCounterText()
    }

    // Render card shaking
    if (this.game.changedCards.shake.length > 0) {
      const shakeRight = { payload: [], delay: 50 }
      const shakeLeft = { payload: [], delay: 50 }
      const shakeCenter = { payload: [], delay: 50 }
      for (const card of this.game.changedCards.shake) {
        const currentElement = this.elements[elementIdFromCard(card)]
        const i = this.game.board.cards.indexOf(card)
        const position = this.positionFromIndex(i)

        shakeRight.payload.push({
          element: currentElement,
          properties: {
            transform: `translateX(${position.x + 15}px)` +
              `translateY(${position.y}px)` +
              'rotateY(180deg)',
            transition: 'transform 100ms'
          }
        })

        shakeLeft.payload.push({
          element: currentElement,
          properties: {
            transform: `translateX(${position.x - 15}px)` +
              `translateY(${position.y}px)` +
              'rotateY(180deg)',
            transition: 'transform 100ms'
          }
        })

        shakeCenter.payload.push({
          element: currentElement,
          properties: {
            transform: `translateX(${position.x}px)` +
              `translateY(${position.y}px)` +
              'rotateY(180deg)',
            transition: 'transform 100ms'
          }
        })
      }
      this.game.changedCards.shake = []
      this.queue.push(
        shakeRight, shakeLeft,
        shakeRight, shakeLeft,
        shakeCenter
      )
    }

    // Render card moving
    if (this.game.changedCards.moved.length > 0) {
      for (const card of this.game.changedCards.moved) {
        const currentElement = this.elements[elementIdFromCard(card)]
        const i = this.game.board.cards.indexOf(card)
        const position = this.positionFromIndex(i)

        this.queue.push({
          payload: [{
            element: currentElement,
            properties: {
              transform: `translateX(${position.x}px)` +
                `translateY(${position.y}px)` +
                'rotateY(180deg)',
              transition: 'transform 300ms'
            }
          }],
          delay: 100
        })
      }
      this.game.changedCards.moved = []
    }

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
      this.queueTimeout = setTimeout(this.processQueue.bind(this), currentQueueItem.delay)
    }
  }

  renderCard (card) {
    const element = document.createElement('div')
    element.classList.add('card')

    // Back
    const back = document.createElement('div')
    back.classList.add('back')
    element.appendChild(back)

    // Front
    const front = document.createElement('div')
    front.classList.add('front')

    const spacer = document.createElement('div')

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

    symbolContainer.appendChild(symbol)
    symbolContainer.appendChild(symbolOutline)

    front.appendChild(spacer.cloneNode(true))
    for (let i = 0; i < symbolCountFromCardNumber(card.number); i++) {
      front.appendChild(symbolContainer.cloneNode(true))
    }
    front.appendChild(spacer.cloneNode(true))

    element.appendChild(front)

    // Overlay
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')
    element.appendChild(overlay)

    element.addEventListener('touchstart', (e) => {
      this.cardClicked(card)
    })

    return element
  }

  cardClicked (card) {
    // console.log(`Clicked: ${card}`)

    if (this.game.board.cards.includes(card)) {
      const currentElement = this.elements[elementIdFromCard(card)]

      if (this.selectedCards.includes(card)) {
        currentElement.classList.remove('selected')

        this.selectedCards.splice(this.selectedCards.indexOf(card), 1)
      } else {
        currentElement.classList.add('selected')

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
      this.elements[elementIdFromCard(card)].classList.remove('selected')
    }

    this.selectedCards = []
  }
}
