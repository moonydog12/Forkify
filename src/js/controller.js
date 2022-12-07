import * as model from './model.js'
import recipeView from './views/recipeView.js'

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

/* 發布/訂閱模式 (Publish–subscribe pattern)
 * 在程式載入的時候執行，把 controlRecipes() 作為參數，傳給負責 View 的 RecipeView class
 * 把畫面載入、DOM操作的功能從 Controller 分離
 */
const init = () => {
  recipeView.addHandlerRender(controlRecipes)
}

init()
