import { async } from 'regenerator-runtime'
import { API_URL } from './config.js'
import { getJSON } from './helpers.js'

// API網址
// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: '',
    results: []
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
