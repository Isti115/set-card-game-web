import Game from './Game'
import Timer from './Timer'
import Renderer from './Renderer'

export default class GameView {
  constructor (app) {
    this.app = app
    this.container = document.createElement('div')

    this.game = new Game(this.finished.bind(this))

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()

    this.timer = new Timer(this.renderer.elements['timer'], this.game)

    this.renderer.elements['deck'].addEventListener('touchstart', this.deal.bind(this), true)
    window.addEventListener('keydown', this.keyDown.bind(this), false)

    this.menuButton = document.createElement('input')
    this.menuButton.id = 'menuButton'
    this.menuButton.type = 'button'
    this.menuButton.value = '<--'
    this.container.appendChild(this.menuButton)
    this.menuButton.addEventListener('click', this.menuPressed.bind(this))

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
    window.setTimeout(this.timer.start.bind(this.timer), 3000)
    this.renderer.render()
    this.state = 'started'
    this.startButton.value = 'Restart'
  }

  finished (real) {
    this.timer.stop()
    this.state = 'finished'
    this.startButton.value = 'Again'

    if (real) {
      const name = window.prompt('Please enter your name:')

      if (name) {
        const highscores = JSON.parse(window.localStorage.getItem('highscores'))
        console.log(highscores)

        highscores.push({name, score: this.timer.getSpm()})
        window.localStorage.setItem('highscores', JSON.stringify(
          highscores.sort((a, b) => b.score - a.score).slice(0, 5)
        ))
      }
    }
  }

  reset () {
    this.game.reset()
    this.renderer.reset()
  }

  menuPressed () {
    ({
      initialized: () => {
        this.app.showMenu()
      },
      started: () => {
        if (window.confirm('Are you sure?')) {
          this.app.showMenu()
        }
      },
      finished: () => {
        this.app.showMenu()
      }
    }[this.state])()
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