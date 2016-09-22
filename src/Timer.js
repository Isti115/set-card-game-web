export default class Timer {
  constructor (container, game) {
    this.container = container
    this.game = game

    this.time = document.createElement('div')
    this.time.id = 'time'
    this.container.appendChild(this.time)

    this.spm = document.createElement('div')
    this.spm.id = 'spm'
    this.container.appendChild(this.spm)

    this.reset()
  }

  reset () {
    this.passedTime = 0
    this.active = false
  }

  start () {
    this.active = true
    this.update()
  }

  update () {
    var minutes = this.passedTime / 60
    var seconds = this.passedTime % 60

    this.time.innerHTML =
      ('0' + Math.floor(minutes)).slice(-2) +
      ':' +
      ('0' + Math.floor(seconds)).slice(-2)

    this.spm.innerHTML = `${this.getSpm()} <br /> Set/Minute`

    this.passedTime++

    if (this.active) {
      setTimeout(this.update.bind(this), 1000)
    }
  }

  stop () {
    this.active = false
  }

  getSpm () {
    var minutes = this.passedTime / 60

    return (this.game.stash.cards.length / 3 / minutes || 0).toFixed(3)
  }
}
