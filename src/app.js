import Game from './game'
import Renderer from './renderer'

export default class App {
  constructor (container) {
    this.container = container

    this.game = new Game()
    this.game.start()

    this.renderer = new Renderer(this.container, this.game)
    this.renderer.init()
    this.renderer.render()

    window.addEventListener('keydown', this.keyDown.bind(this), false)
    this.renderer.elements['deck'].addEventListener('click', this.deal.bind(this), true)
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
