class WebSocketManager {
  constructor (address) {
    this.address = address

    this.open = this.open.bind(this)
    this.message = this.message.bind(this)
    this.sendScore = this.sendScore.bind(this)

    this.globalScores = []
    this.dailyScores = []

    this.scoreReceived = []
  }

  open () {
    this.ws = new window.WebSocket(this.address)
    this.ws.addEventListener('message', this.message)
  }

  message (msg) {
    console.log(msg)
    const message = JSON.parse(msg.data)

    if (message.type === 'globalScores') {
      window.localStorage.setItem('globalScores', JSON.stringify(message.data))
    }

    for (const callback of this.scoreReceived) {
      callback()
    }
  }

  sendScore (name, score) {
    this.ws.send(JSON.stringify({
      type: 'score',
      data: {name, score}
    }))
  }
}

export default new WebSocketManager('ws://waik.hu/set')
