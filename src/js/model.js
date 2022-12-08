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
  }
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
