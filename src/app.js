import Game from './game'
import Timer from './timer'
import Renderer from './renderer'

export default class App {
  constructor (container) {
    this.container = container

    this.zoomToFit()

    this.game = new Game(this.finished.bind(this))
    this.timer = new Timer(document.getElementById('timer'), this.game)

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()

    window.addEventListener('keydown', this.keyDown.bind(this), false)
    document.getElementById('deck').addEventListener('touchstart', this.deal.bind(this), true)
  }

  start () {
    this.game.start()
    this.timer.start()
    this.renderer.render()
  }

  finished () {
    console.log('finished')
    this.timer.stop()
  }

  zoomToFit () {
    const ratio = this.container.clientHeight / 535
    document.body.style.transform = `scale(${ratio})`
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
    this.game.deal(3)
    this.renderer.render()
  }

  hint () {
    console.log('hint here')
  }
}
