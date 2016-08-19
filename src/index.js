import Game from './game'
import Renderer from './renderer'

window.addEventListener('load', init, false)

function init () {
  const container = document.body

  const game = new Game()
  game.start()

  window.game = game

  const renderer = new Renderer(container, game)

  renderer.render()
}
