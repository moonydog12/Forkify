import { API_URL } from './config.js'
import { getJSON } from './helpers.js'

// API網址
// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {}
}

export const loadRecipe = async (recipeId) => {
  try {
    const data = await getJSON(`${API_URL}/${recipeId}`)

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
