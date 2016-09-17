import Game from './Game'
import Timer from './Timer'
import Renderer from './Renderer'

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

    // New Game Button
    this.newGameButton = document.createElement('input')
    this.newGameButton.id = 'newGameButton'
    this.newGameButton.type = 'button'
    this.newGameButton.value = 'New Game'
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
