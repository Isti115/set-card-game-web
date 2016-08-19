export default class Renderer {
  constructor (container, game) {
    this.container = container
    this.game = game
  }

  setContainer (container) {
    this.container = container
  }

  setGame (game) {
    this.game = game
  }

  render () {
    // Draw the actual state
  }
}
