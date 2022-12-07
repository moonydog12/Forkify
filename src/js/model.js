export const state = {
  recipe: {}
}

export const loadRecipe = async (recipeId) => {
  try {
    const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`${data.message}(${response.status})`)
    }

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
    window.alert(error)
  }
}
