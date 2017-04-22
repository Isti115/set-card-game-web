import webSocketManager from './webSocketManager'
import Game from './Game'
import Timer from './Timer'
import Renderer from './Renderer'

export default class GameView {
  constructor (app) {
    this.app = app
    this.container = document.createElement('div')
    this.container.id = 'gameView'

    this.game = new Game(this.finished.bind(this))

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()

    this.timer = new Timer(this.renderer.elements['timer'], this.game)

    this.renderer.elements['deck'].addEventListener('touchstart', this.deal.bind(this), true)
    window.addEventListener('keydown', this.keyDown.bind(this), false)

    this.pauseButton = document.createElement('input')
    this.pauseButton.id = 'pauseButton'
    this.pauseButton.type = 'button'
    this.container.appendChild(this.pauseButton)
    this.pauseButton.addEventListener('click', this.menuPressed.bind(this))

    this.startButton = document.createElement('input')
    this.startButton.id = 'startButton'
    this.startButton.type = 'button'
    this.container.appendChild(this.startButton)
    this.startButton.addEventListener('click', this.startPressed.bind(this))

    this.state = 'initialized'
  }

  start () {
    this.game.start()
    window.setTimeout(this.timer.start, 3000)
    this.renderer.render()

    ;({
      initialized: () => {
        this.startButton.dataset.state = 'animating'
        setTimeout(() => {
          this.startButton.dataset.state = 'animated'
        }, 2000)
      },

      finished: () => {
        this.startButton.dataset.state = 'animated'
        this.timer.update()
      }
    }[this.state])()

    this.state = 'started'
  }

  finished (real) {
    this.timer.stop()
    this.timer.update()
    this.state = 'finished'
    this.startButton.dataset.state = 'finished'

    setTimeout(() => {
      if (real) {
        if (!window.localStorage.getItem('lastUsedName')) {
          window.localStorage.setItem('lastUsedName', 'Guest')
        }
        const lastUsedName = window.localStorage.getItem('lastUsedName')

        const name = window.prompt('Please enter your name:', lastUsedName)

        if (name) {
          window.localStorage.setItem('lastUsedName', name)
          const highscores = JSON.parse(window.localStorage.getItem('localScores'))

          const score = this.timer.getSpm()

          highscores.push({name, score})
          window.localStorage.setItem('localScores', JSON.stringify(
            highscores.sort((a, b) => b.score - a.score).slice(0, 10)
          ))

          if (webSocketManager.ready) {
            webSocketManager.sendScore(name, score)
          } else {
            const queuedScores = JSON.parse(window.localStorage.getItem('queuedScores'))
            queuedScores.push({name, score, date: new Date()})
            window.localStorage.setItem('queuedScores', JSON.stringify(queuedScores))
          }
        }
      }
    }, 300)
  }

  reset () {
    this.timer.reset()
    this.game.reset()
    this.renderer.reset()
  }

  menuPressed () {
    ;({
      initialized: () => {
        this.app.showMenu()
      },
      started: () => {
        this.app.showMenu()
      },
      finished: () => {
        this.app.showMenu()
      }
    }[this.state])()
  }

  startPressed () {
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
