import Game from './game'
import Renderer from './renderer'

window.addEventListener('load', init, false)

const App = {}

function init () {
  const container = document.body

  const game = new Game()
  game.start()

  window.game = game

  App.renderer = new Renderer(container, game)
  App.renderer.init()

  App.renderer.render()

  window.addEventListener('keydown', keyDown, false)
}

function keyDown (e) {
  if (e.code === 'KeyD') {
    deal()
  }
}

function deal () {
  game.deal(3)
  App.renderer.render()
}
