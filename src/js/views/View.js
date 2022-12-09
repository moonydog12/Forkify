import icons from '../../img/icons.svg'

export default class View {
  _data

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Near Luo
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    if (!render) {
      return markup
    }

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  // 只更新更動的子元素(不重新渲染 parent 元素)
  update(data) {
    this._data = data
    const newMarkup = this._generateMarkup()

    // note: 字串轉成 DOM 物件
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = [...newDOM.querySelectorAll('*')]
    const currentElements = [...this._parentElement.querySelectorAll('*')]

    newElements.forEach((newEl, index) => {
      const curEl = currentElements[index]

      // 更新文字更動的元素
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }

      // 更新屬性更動的元素
      if (!newEl.isEqualNode(curEl)) {
        ;[...newEl.attributes].forEach((attr) => curEl.setAttribute(attr.name, attr.value))
      }
    })
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderSpinner = () => {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError = (message = this._errorMessage) => {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}g#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage = (message = this._message) => {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}
