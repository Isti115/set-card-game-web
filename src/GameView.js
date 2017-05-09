import webSocketManager from './webSocketManager'
import Game from './Game'
import NameInput from './NameInput'
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

    this.nameInput = new NameInput()
    this.nameInput.container.id = 'nameInput'
    this.nameInput.addEventListener('open', () => this.container.classList.add('blurred'))
    this.nameInput.addEventListener('close', () => this.container.classList.remove('blurred'))
    this.container.appendChild(this.nameInput.container)

    this.renderer.elements['deck'].addEventListener('touchstart', () => {
      if (this.state === 'started' &&
      window.confirm('Are you sure you would like to deal more cards? This will invalidate your score.')) {
        this.valid = false
        this.deal()
      }
    }, true)

    this.renderer.elements['timer'].addEventListener('touchstart', () => {
      if (this.state === 'started' &&
      window.confirm('Are you sure you would like to ask for a hint? This will invalidate your score.')) {
        this.valid = false
        this.hint()
      }
    }, true)

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
    this.valid = true

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

  /**
   * Processes the score at the end of a game
   * @param {boolean} real determines whether the game has been really finished or interrupted
   */
  finished (real) {
    this.timer.stop()
    this.timer.update()
    this.state = 'finished'
    this.startButton.dataset.state = 'finished'

    setTimeout(() => {
      if (real && this.valid) {
        const score = this.timer.getSpm()

        const callback = (name) => {
          if (name) {
            const highscores = JSON.parse(window.localStorage.getItem('localScores'))

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

          this.nameInput.removeEventListener('submit', callback)
        }

        this.nameInput.addEventListener('submit', callback)
        this.nameInput.open()
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

  deal () {
    if (this.game.deck.cards.length >= 3) {
      this.game.deal(3)
      this.renderer.render()
    }
  }

  hint () {
    const foundCards = this.game.foundSet.map(i => this.game.board.cards[i])
    this.game.changedCards.shake.push(...foundCards)
    this.renderer.render()
  }
}
