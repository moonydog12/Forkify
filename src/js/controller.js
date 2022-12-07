import * as model from './model.js'
import recipeView from './views/recipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// const timeout = function (s) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`))
//     }, s * 1000)
//   })
// }
// API網址
// https://forkify-api.herokuapp.com/v2

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
    alert(error)
  }
}

// Listeners
// note:hashchange
const windowEvents = ['hashchange', 'load']
windowEvents.forEach((event) => window.addEventListener(event, controlRecipes))
