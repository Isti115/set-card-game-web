export default class Timer {
  constructor (container, game) {
    this.container = container
    this.game = game

    this.startTime = 0
    this.active = false

    this.time = document.createElement('div')
    this.time.id = 'time'
    this.container.appendChild(this.time)

    this.spm = document.createElement('div')
    this.spm.id = 'spm'
    this.container.appendChild(this.spm)
  }

  start () {
    this.startTime = Date.now()
    this.active = true
    setTimeout(this.update.bind(this), 100)
  }

  update () {
    const currentTime = Date.now()
    const passedTime = currentTime - this.startTime

    var minutes = passedTime / 1000 / 60
    var seconds = passedTime / 1000 % 60

    this.time.innerHTML =
      ('0' + Math.floor(minutes)).slice(-2) +
      ':' +
      ('0' + Math.floor(seconds)).slice(-2)

    this.spm.innerHTML = `${(this.game.stash.cards.length / 3 / minutes).toFixed(3)} <br /> Set/Minute`

    if (this.active) {
      setTimeout(this.update.bind(this), 1050 - (passedTime % 1000))
    }
  }

  stop () {
    this.active = false
  }
}
