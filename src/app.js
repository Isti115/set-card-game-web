import Game from './game'
import Timer from './timer'
import Renderer from './renderer'

export default class App {
  constructor (container) {
    this.container = container

    this.zoomToFit()

    this.game = new Game(this.finished.bind(this))

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()

    this.timer = new Timer(this.renderer.elements['timer'], this.game)

    this.renderer.elements['deck'].addEventListener('touchstart', this.deal.bind(this), true)
    window.addEventListener('keydown', this.keyDown.bind(this), false)

    this.startButton = document.createElement('input')
    this.startButton.id = 'startButton'
    this.startButton.type = 'button'
    this.startButton.value = 'Start'
    this.container.appendChild(this.startButton)
    this.startButton.addEventListener('click', this.buttonPressed.bind(this))

    this.state = 'initialized'
  }

  start () {
    this.game.start()
    this.timer.start()
    this.renderer.render()
    this.state = 'started'
    this.startButton.value = 'Restart'
  }

  finished () {
    this.timer.stop()
    this.state = 'finished'
    this.startButton.value = 'Play again'
  }

  reset () {
    this.game.reset()
    this.renderer.reset()
  }

  zoomToFit () {
    const ratio = this.container.clientHeight / 535
    document.body.style.transform = `scale(${ratio})`
  }

  buttonPressed () {
    ({
      initialized: () => {
        this.start()
      },
      started: () => {
        if (window.confirm('Are you sure?')) {
          this.finished()
          this.reset()
          this.start()
        }
      },
      finished: () => {
        this.reset()
        this.start()
      }
    }[this.state])()
  }

  keyDown (e) {
    if (e.code === 'KeyD') {
      this.deal()
    }

    if (e.code === 'KeyH') {
      this.hint()
    }
  }

  deal () {
    if (this.game.deck.cards.length >= 3) {
      this.game.deal(3)
      this.renderer.render()
    }
  }

  hint () {
    console.log('hint here')
  }
}
