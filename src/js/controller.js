import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksViews from './views/bookmarksView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// 載入食譜 controller
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    // 0)更新 results view(標註被選擇的搜尋結果)
    resultsView.update(model.getSearchResultsPage())

    // 1)更新書籤
    bookmarksViews.update(model.state.bookmarks)

    // 2)讀取API食譜資料
    await model.loadRecipe(id)

    // 3)渲染食譜
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
  }

  controlServings()
}

// 搜尋功能 controller
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

// 分頁功能 controller
const controlPagination = (goToPage) => {
  // 1) 渲染新搜尋結果
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) 渲染頁數按鈕(根據當前頁數)
  paginationView.render(model.state.search)
}

// 用餐人數渲染功能 controller
const controlServings = (newServings) => {
  // 更新 recipe serving(in state)
  model.updateServings(newServings)

  // 更新 recipe view (只更新有變動的部分，不更新全部畫面)
  recipeView.update(model.state.recipe)
}

// 新增/移除 書籤功能 controller
const controlAddBookmark = () => {
  // 1) 新增/移除書籤
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else {
    model.deleteBookmark(model.state.recipe.id)
  }

  // 2) 更新食譜頁面書籤狀態
  recipeView.update(model.state.recipe)

  // 3)渲染書籤
  bookmarksViews.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  bookmarksViews.render(model.state.bookmarks)
}

/* 發布/訂閱模式 (Publish–subscribe pattern)
 * 在程式載入的時候執行，把 controlRecipes() 作為引數，傳給負責 View 的 RecipeView class
 * 把畫面載入、DOM操作的功能從 Controller 分離
 */
const init = () => {
  bookmarksViews.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}

init()
