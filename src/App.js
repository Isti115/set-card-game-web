import MenuView from './MenuView'
import GameView from './GameView'

export default class App {
  constructor (container) {
    this.container = container

    this.showMenu = this.showMenu.bind(this)
    this.showGame = this.showGame.bind(this)

    this.zoomToFit()

    this.menuView = new MenuView(this)
    this.gameView = new GameView(this)

    this.showMenu()
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
    this.clearContainer()
    this.container.appendChild(this.menuView.container)
    this.menuView.populateLeaderboard()
  }

  showGame () {
    this.clearContainer()
    this.container.appendChild(this.gameView.container)
  }
}
