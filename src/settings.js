class Settings {
  constructor () {
    this.container = document.createElement('div')
    this.container.id = 'settings'

    // Night mode toggle
    this.nightModeCheckbox = document.createElement('input')
    this.nightModeCheckbox.id = 'nightModeCheckbox'
    this.nightModeCheckbox.type = 'checkBox'
    this.nightModeCheckbox.value = 'Night mode'
    this.nightModeCheckbox.addEventListener('click', this.toggleNightMode)
    this.container.appendChild(this.nightModeCheckbox)

    this.nightModeCheckboxLabel = document.createElement('label')
    this.nightModeCheckboxLabel.htmlFor = 'nightModeCheckbox'
    this.nightModeCheckboxLabel.appendChild(document.createTextNode('Night mode'))
    this.container.appendChild(this.nightModeCheckboxLabel)
  }

  toggleNightMode (e) {
    if (e.target.checked) {
      document.body.classList.add('nightMode')
    } else {
      document.body.classList.remove('nightMode')
    }
  }
}

export default new Settings()
