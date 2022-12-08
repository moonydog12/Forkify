class SearchView {
  _parentEl = document.querySelector('.search')

  #clearInput() {
    this._parentEl.querySelector('.search__field').value = ''
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value
    this.#clearInput()
    return query
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', (event) => {
      event.preventDefault()
      handler()
    })
  }
}

export default new SearchView()
