import Game from './game'

window.addEventListener('load', init, false)

function init () {
  const container = document.body

  const game = new Game(container)
  game.start()
}
