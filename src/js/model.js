import { API_URL, RES_PER_PAGE, KEY } from './config.js'
import { AJAX } from './helpers.js'

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

const createRecipeObject = (data) => {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  }
}

// 載入食譜
export const loadRecipe = async (recipeId) => {
  try {
    const data = await AJAX(`${API_URL}${recipeId}?key=${KEY}`)
    state.recipe = createRecipeObject(data)

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
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

// 上傳食譜
export const uploadRecipe = async (newRecipe) => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ingredient) => {
        const ingredientArray = ingredient[1].split(',').map((el) => el.trim())
        if (ingredientArray.length !== 3) {
          throw new Error('Wrong ingredient format!')
        }
        const [quantity, unit, description] = ingredientArray
        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
  } catch (error) {
    throw new Error(error)
  }
}
