import { API_URL, RES_PER_PAGE } from './config.js'
import { getJSON } from './helpers.js'

// API網址
// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []
}

// 載入食譜
export const loadRecipe = async (recipeId) => {
  try {
    const data = await getJSON(`${API_URL}${recipeId}`)

    // reformat the recipe object from api format
    const {
      id,
      title,
      publisher,
      source_url: sourceUrl,
      image_url: image,
      servings,
      cooking_time: cookingTime,
      ingredients
    } = data.data.recipe

    state.recipe = {
      id,
      title,
      publisher,
      sourceUrl,
      image,
      servings,
      cookingTime,
      ingredients
    }

    if (state.bookmarks.some((bookmark) => bookmark.id === recipeId)) {
      state.recipe.bookmarked = true
    } else {
      state.recipe.bookmarked = false
    }
  } catch (error) {
    throw new Error(error)
  }
}

// 載入搜尋結果
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query
    const data = await getJSON(`${API_URL}?search=${query}`)

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url
      }
    })
    state.search.page = 1
  } catch (error) {
    throw new Error(error)
  }
}

// 計算單頁顯示品項數量
export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page
  const start = (page - 1) * state.search.resultsPerPage
  const end = page * state.search.resultsPerPage
  return state.search.results.slice(start, end)
}

// 更新用餐人數
export const updateServings = (newServings = state.recipe.servings) => {
  state.recipe.ingredients.forEach((ingredient) => {
    // newQt = oldQt * newServings / oldServings
    ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings
  })

  state.recipe.servings = newServings
}

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

// 添加書籤
export const addBookmark = (recipe) => {
  // 新增書籤
  state.bookmarks.push(recipe)

  // 標註目前的食譜成書籤
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true
  }

  persistBookmarks()
}

export const deleteBookmark = (id) => {
  // 刪除書籤
  const index = state.bookmarks.findIndex((element) => element.id === id)
  state.bookmarks.splice(index, 1)

  // 標註目前的食譜 "不是" 書籤
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false
  }

  persistBookmarks()
}

// 載入local-storage書籤資料
const init = () => {
  const storage = localStorage.getItem('bookmarks')
  if (storage) {
    state.bookmarks = JSON.parse(storage)
  }
}

init()
