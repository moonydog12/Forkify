import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    // 1)讀取API食譜資料
    await model.loadRecipe(id)
    const { recipe } = model.state

    // 2)渲染食譜
    recipeView.render(recipe)
  } catch (error) {
    recipeView.renderError()
  }
}

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner()

    // 1) 取得查詢字串
    const query = searchView.getQuery()
    if (!query) return

    // 2) 載入搜尋結果
    await model.loadSearchResults(query)

    // 3) 渲染結果至畫面
    resultsView.render(model.getSearchResultsPage())

    // 4) 渲染頁數按鈕(初始化)
    paginationView.render(model.state.search)
  } catch (error) {
    throw new Error(error)
  }
}

const controlPagination = (goToPage) => {
  // 1) 渲染新搜尋結果
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) 渲染頁數按鈕(根據當前頁數)
  paginationView.render(model.state.search)
}

/* 發布/訂閱模式 (Publish–subscribe pattern)
 * 在程式載入的時候執行，把 controlRecipes() 作為引數，傳給負責 View 的 RecipeView class
 * 把畫面載入、DOM操作的功能從 Controller 分離
 */
const init = () => {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}

init()
