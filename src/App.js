import webSocketManager from './webSocketManager'
import MenuView from './MenuView'
import GameView from './GameView'

export default class App {
  constructor (container) {
    this.container = container

    this.showMenu = this.showMenu.bind(this)
    this.showGame = this.showGame.bind(this)

    const width = 915
    const height = 515
    this.zoomToFit(width, height)

    this.menuView = new MenuView(this)
    this.gameView = new GameView(this)

    webSocketManager.scoreReceived.push(this.menuView.updateHighscoreTables)

    window.wsm = webSocketManager
    webSocketManager.init()

    window.addEventListener('resize', () => this.zoomToFit(width, height), false)

    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => {
        if (document.getElementById('gameView')) {
          this.gameView.menuPressed()
        } else {
          if (window.confirm('Current game progress will be lost on exit. Would you surely like to quit?')) {
            navigator.app.exitApp()
          }
        }
      }, true)
    }, false)

    this.showMenu()
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
    if (!window.localStorage.getItem('queuedScores')) {
      window.localStorage.setItem('queuedScores', '[]')
    }

    const queuedScores = JSON.parse(window.localStorage.getItem('queuedScores'))
    webSocketManager.sendQueuedScores(queuedScores)

    webSocketManager.send(JSON.stringify({type: 'scoreRequest'}))
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
