class WebSocketManager {
  constructor (address) {
    this.address = address

    this.open = this.open.bind(this)
    this.message = this.message.bind(this)
    this.close = this.close.bind(this)
    this.sendScore = this.sendScore.bind(this)

    this.statusIndicator = document.createElement('div')
    this.statusIndicator.id = 'websocketStatusIndicator'

    this.indicatorDiv = document.createElement('div')
    this.indicatorDiv.id = 'indicatorDiv'
    this.statusIndicator.appendChild(this.indicatorDiv)

    this.statusIndicator.appendChild(document.createTextNode('WebSocket status: '))
    this.statusSpan = document.createElement('span')
    this.statusIndicator.appendChild(this.statusSpan)

    this.statusIndicator.setAttribute('status', 'inactive')
    this.statusSpan.innerText = 'Inactive'

    this.statusIndicator.addEventListener('click', () => this.init())

    this.scoreReceived = []
  }

  init () {
    this.ws = new window.WebSocket(this.address)
    this.ws.addEventListener('open', this.open)
    this.ws.addEventListener('message', this.message)
    this.ws.addEventListener('error', this.error)
    this.ws.addEventListener('close', this.close)
  }

  open () {
    this.statusIndicator.setAttribute('status', 'open')
    this.statusSpan.innerText = 'Open'
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

  close () {
    this.statusIndicator.setAttribute('status', 'closed')
    this.statusSpan.innerText = 'Closed'
  }

  sendScore (name, score) {
    this.ws.send(JSON.stringify({
      type: 'score',
      data: {name, score}
    }))
  }
}

export default new WebSocketManager('ws://waik.hu/set')
