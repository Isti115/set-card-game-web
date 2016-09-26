import webSocketManager from './webSocketManager'
import MenuView from './MenuView'
import GameView from './GameView'

export default class App {
  constructor (container) {
    this.container = container

    this.showMenu = this.showMenu.bind(this)
    this.showGame = this.showGame.bind(this)

    this.zoomToFit(915, 515)

    this.menuView = new MenuView(this)
    this.gameView = new GameView(this)

    webSocketManager.scoreReceived.push(this.menuView.updateHighscoreTables)

    this.showMenu()

    window.wsm = webSocketManager
    webSocketManager.init()
  }

  zoomToFit (width, height) {
    const widthRatio = this.container.clientWidth / width
    const heightRatio = this.container.clientHeight / height

    document.body.style.transform = `scale(${Math.min(widthRatio, heightRatio)})`
  }

  clearContainer () {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  showMenu () {
    this.clearContainer()
    this.menuView.updateHighscoreTables()
    this.container.appendChild(this.menuView.container)

    this.gameView.timer.stop()
  }

  showGame () {
    this.clearContainer()
    this.container.appendChild(this.gameView.container)

    if (this.gameView.state === 'started') {
      this.gameView.timer.start()
    }
  }
}
