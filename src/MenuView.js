import settings from './settings'

export default class MenuView {
  constructor (app) {
    this.app = app
    this.container = document.createElement('div')

    this.populateLeaderboard = this.populateLeaderboard.bind(this)

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
    version.appendChild(document.createTextNode('v0.2.7'))
    about.appendChild(version)

    this.container.appendChild(about)

    // Settings
    this.container.appendChild(settings.container)

    // New Game Button
    this.newGameButton = document.createElement('input')
    this.newGameButton.id = 'newGameButton'
    this.newGameButton.type = 'button'
    this.newGameButton.value = 'New Game / Continue'
    this.newGameButton.addEventListener('click', this.app.showGame)
    this.container.appendChild(this.newGameButton)

    // Leaderboard Table
    this.leaderboardTable = document.createElement('table')
    this.leaderboardTable.id = 'leaderboardTable'
    this.container.appendChild(this.leaderboardTable)

    this.populateLeaderboard()
  }

  populateLeaderboard () {
    if (!window.localStorage.getItem('highscores')) {
      window.localStorage.setItem('highscores', '[]')
    }
    const scores = JSON.parse(window.localStorage.getItem('highscores'))

    while (this.leaderboardTable.firstChild) {
      this.leaderboardTable.removeChild(this.leaderboardTable.firstChild)
    }

    const headerRow = document.createElement('tr')
    const headerCell = document.createElement('th')
    headerCell.colSpan = '2'
    headerCell.appendChild(document.createTextNode('Highscores'))
    headerRow.appendChild(headerCell)
    this.leaderboardTable.appendChild(headerRow)

    for (const score of scores) {
      const tr = document.createElement('tr')

      const td1 = document.createElement('td')
      td1.appendChild(document.createTextNode(score.name))
      tr.appendChild(td1)

      const td2 = document.createElement('td')
      td2.appendChild(document.createTextNode(score.score))
      tr.appendChild(td2)

      this.leaderboardTable.appendChild(tr)
    }
  }
}
