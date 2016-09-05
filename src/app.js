import Game from './game'
import Renderer from './renderer'

export default class App {
  constructor (container) {
    this.container = container

    this.zoomToFit()

    this.game = new Game()

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()

    window.addEventListener('keydown', this.keyDown.bind(this), false)
    this.renderer.elements['deck'].addEventListener('click', this.deal.bind(this), true)
  }

  start () {
    this.game.start()
    this.renderer.render()
  }

  zoomToFit () {
    const ratio = this.container.clientHeight / 535
    document.body.style.transform = `scale(${ratio})`
  }

  keyDown (e) {
    if (e.code === 'KeyD') {
      this.deal()
    }
  }

  deal () {
    this.game.deal(3)
    this.renderer.render()
  }
}
