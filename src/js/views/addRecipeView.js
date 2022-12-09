import View from './View.js'

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload')
  _message = 'Recipe was successfully uploaded'
  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')
  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _btnClose = document.querySelector('.btn--close-modal')

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerHideWindow()
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => this.toggleWindow())
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', () => this.toggleWindow())
    this._overlay.addEventListener('click', () => this.toggleWindow())
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event.target)
      const dataArray = [...new FormData(event.target)]

      // 把陣列轉換成物件
      const data = Object.fromEntries(dataArray)
      handler(data)
    })
  }
}

export default new AddRecipeView()
