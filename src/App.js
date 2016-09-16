import GameView from './GameView'

export default class App {
  constructor (container) {
    this.container = container

    this.zoomToFit()

    this.gameView = new GameView(this)

    this.showGame()
  }

  zoomToFit () {
    const ratio = this.container.clientHeight / 535
    document.body.style.transform = `scale(${ratio})`
  }

  clearContainer () {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  showMenu () {
    console.log('menu shown')
  }

  showGame () {
    this.clearContainer()
    this.container.appendChild(this.gameView.container)
  }
}
