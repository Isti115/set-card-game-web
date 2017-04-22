export default class NameInput {
  constructor () {
    (() => {
      const container = document.createElement('div')

      Object.defineProperty(this, 'container', {
        get: () => { return container },
        set: () => { throw new Error('The container of NameInput should be constant.') }
      })
    })()

    this.container.classList.add('nameInput')
    this.container.dataset.state = 'closed'

    this.left = document.createElement('div')
    this.left.classList.add('nameInput-left')

    this.leftP = document.createElement('p')
    this.leftP.innerText = 'Please enter your name:'
    this.left.appendChild(this.leftP)

    this.textInput = document.createElement('input')
    this.textInput.type = 'text'
    this.textInput.placeholder = 'Guest'
    this.left.appendChild(this.textInput)

    this.submitButton = document.createElement('input')
    this.submitButton.type = 'button'
    this.submitButton.value = 'Submit'
    this.submitButton.addEventListener('click', () => this.handleSubmitButtonClick())
    this.left.appendChild(this.submitButton)

    this.container.appendChild(this.left)

    this.right = document.createElement('div')
    this.right.classList.add('nameInput-right')

    this.rightP = document.createElement('p')
    this.rightP.innerText = 'Or choose a recent entry:'
    this.right.appendChild(this.rightP)

    this.container.appendChild(this.right)

    this.eventListeners = {
      close: [],
      open: [],
      submit: []
    }

    this.addEventListener('open', this.populateRight.bind(this))
    this.addEventListener('open', () => { this.container.dataset.state = 'open' })
    this.addEventListener('close', () => { this.container.dataset.state = 'closed' })
    this.addEventListener('submit', this.updateRecentNames.bind(this))
    this.addEventListener('submit', () => this.close())
  }

  // get container () {
  //   return this.container
  // }

  addEventListener (event, callback) {
    if (!(event in this.eventListeners)) {
      throw new Error(`Cannot add event listener to NameInput for unknown event type: ${event}`)
    }

    this.eventListeners[event].push(callback)
  }

  removeEventListener (event, callback) {
    if (!(event in this.eventListeners)) {
      throw new Error(`Cannot remove event listener from NameInput for unknown event type: ${event}`)
    } else if (!this.eventListeners[event].includes(callback)) {
      throw new Error(`Cannot remove event listener from NameInput because it has not been found as a callback for event type: ${event}`)
    }

    this.eventListeners[event].splice(this.eventListeners[event].indexOf(callback))
  }

  open () {
    for (const callback of this.eventListeners['open']) {
      callback()
    }
  }

  submit (value) {
    for (const callback of this.eventListeners['submit']) {
      callback(value)
    }
  }

  close () {
    this.container.dataset.state = 'closed'

    for (const callback of this.eventListeners['close']) {
      callback()
    }
  }

  handleSubmitButtonClick () {
    const value = this.textInput.value
    this.textInput.value = ''

    if (value === '' &&
      !window.confirm('No name has been entered, are you sure that you want to discard your score?')) {
      return
    }

    this.submit(value)
  }

  get recentNames () {
    if (window.localStorage.getItem('recentNames') === null) {
      const recentNames = []
      const lastUsedName = window.localStorage.getItem('lastUsedName')

      if (lastUsedName !== null) {
        recentNames.push(lastUsedName)
      }

      window.localStorage.setItem('recentNames', JSON.stringify(recentNames))
    }

    return JSON.parse(window.localStorage.getItem('recentNames'))
  }

  set recentNames (recentNames) {
    window.localStorage.setItem('recentNames', JSON.stringify(recentNames))
  }

  updateRecentNames (value) {
    if (value === '') {
      return
    }

    const recentNames = this.recentNames

    if (recentNames.includes(value)) {
      recentNames.splice(recentNames.indexOf(value), 1)
    }

    recentNames.unshift(value)

    while (recentNames.length > 3) {
      recentNames.pop()
    }

    this.recentNames = recentNames
  }

  populateRight () {
    const buttons = this.right.getElementsByTagName('input')

    for (const button of buttons) {
      this.right.removeChild(button)
    }

    const recentNames = this.recentNames

    for (const name of recentNames) {
      const currentNameButton = document.createElement('input')
      currentNameButton.type = 'button'
      currentNameButton.value = name
      currentNameButton.addEventListener('click', () => {
        this.textInput.value = name
        this.handleSubmitButtonClick()
      })

      this.right.appendChild(currentNameButton)
    }
  }
}
