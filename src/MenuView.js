import settings from './settings'
import webSocketManager from './webSocketManager'

export default class MenuView {
  constructor (app) {
    this.app = app
    this.container = document.createElement('div')
    this.container.id = 'menuView'

    this.updateHighscoreTables = this.updateHighscoreTables.bind(this)

    // Menu Title
    this.menuTitle = document.createElement('div')
    this.menuTitle.id = 'menuTitle'
    this.menuTitle.appendChild(document.createTextNode('SET'))
    this.container.appendChild(this.menuTitle)

    // About
    const about = document.createElement('span')
    about.id = 'about'

    const author = document.createElement('span')
    author.id = 'author'
    author.appendChild(document.createTextNode('by Isti115'))
    about.appendChild(author)

    const version = document.createElement('span')
    version.id = 'version'
    version.appendChild(document.createTextNode('v0.2.15'))
    about.appendChild(version)

    this.container.appendChild(about)

    // Settings
    this.container.appendChild(settings.container)

    // New Game Button
    this.newGameButton = document.createElement('input')
    this.newGameButton.id = 'newGameButton'
    this.newGameButton.type = 'button'
    this.newGameButton.value = 'New Game'
    this.newGameButton.addEventListener('click', this.app.showGame)
    this.container.appendChild(this.newGameButton)

    // Server Connection Status
    this.container.appendChild(webSocketManager.statusIndicator)

    // Highscore Tables

    this.highscoreTableContainer = document.createElement('div')
    // this.highscoreTableContainer.setAttribute('score-type', 'local')
    this.highscoreTableContainer.id = 'highscoreTableContainer'

    this.highscoreTables = []

    this.localHighscoreTable = this.makeHighscoreTable('Local Highscores')
    this.localHighscoreTable.id = 'localHighscoreTable'
    this.localHighscoreTable.storageKey = 'localScores'
    this.highscoreTables.push(this.localHighscoreTable)

    this.globalHighscoreTable = this.makeHighscoreTable('Global Highscores')
    this.globalHighscoreTable.id = 'globalHighscoreTable'
    this.globalHighscoreTable.storageKey = 'globalScores'
    this.highscoreTables.push(this.globalHighscoreTable)

    this.dailyHighscoreTable = this.makeHighscoreTable('Daily Highscores')
    this.dailyHighscoreTable.id = 'dailyHighscoreTable'
    this.dailyHighscoreTable.storageKey = 'dailyScores'
    this.highscoreTables.push(this.dailyHighscoreTable)

    this.personalHighScoreTable = this.makeHighscoreTable('Personal Highscores')
    this.personalHighScoreTable.id = 'parsonalHighscoreTable'
    this.personalHighScoreTable.storageKey = 'personalScores'
    this.highscoreTables.push(this.personalHighScoreTable)

    for (const highscoreTable of this.highscoreTables) {
      this.highscoreTableContainer.appendChild(highscoreTable)
    }

    this.container.appendChild(this.highscoreTableContainer)

    this.highscoreTableRotation = 0

    this.highscoreTableContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].clientX
    })
    this.highscoreTableContainer.addEventListener('touchend', (e) => {
      const distance = e.changedTouches[0].clientX - this.touchStartX
      if (Math.abs(distance) > 0) {
        this.rotateHighscoreTables(distance / Math.abs(distance))
      }
    })

    this.highscoreRotationHelp = document.createElement('span')
    this.highscoreRotationHelp.id = 'highscoreRotationHelp'
    this.highscoreRotationHelp.appendChild(document.createTextNode('Swipe or drag left / right to change view!'))
    this.container.appendChild(this.highscoreRotationHelp)
  }

  makeHighscoreTable (title) {
    const highscoreTable = document.createElement('table')

    const thead = document.createElement('thead')

    const headerRow = document.createElement('tr')
    const headerCell = document.createElement('th')
    headerCell.colSpan = '2'
    headerCell.appendChild(document.createTextNode(title))
    headerRow.appendChild(headerCell)
    thead.appendChild(headerRow)

    highscoreTable.appendChild(thead)

    const tbody = document.createElement('tbody')
    highscoreTable.appendChild(tbody)
    highscoreTable.body = tbody

    return highscoreTable
  }

  populateHighscoreTable (highscoreTable, scores) {
    while (highscoreTable.body.firstChild) {
      highscoreTable.body.removeChild(highscoreTable.body.firstChild)
    }

    for (const score of scores) {
      const tr = document.createElement('tr')

      const nameTd = document.createElement('td')
      nameTd.appendChild(document.createTextNode(score.name))
      tr.appendChild(nameTd)

      const scoreTd = document.createElement('td')
      scoreTd.appendChild(document.createTextNode(score.score.toFixed(3)))
      tr.appendChild(scoreTd)

      highscoreTable.body.appendChild(tr)
    }
  }

  updateHighscoreTables () {
    for (const highscoreTable of this.highscoreTables) {
      if (!window.localStorage.getItem(highscoreTable.storageKey)) {
        window.localStorage.setItem(highscoreTable.storageKey, '[]')
      }
      const scores = JSON.parse(window.localStorage.getItem(highscoreTable.storageKey))

      this.populateHighscoreTable(highscoreTable, scores)
    }
  }

  rotateHighscoreTables (direction) {
    this.highscoreTableContainer.style.transform =
      `translateX(375px) translateY(15px) rotateY(${this.highscoreTableRotation += 90 * direction}deg)`
  }
}
