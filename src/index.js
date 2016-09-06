import App from './app'

window.addEventListener('load', () => {
  const app = new App(document.body)
  window.app = app
}, false)
