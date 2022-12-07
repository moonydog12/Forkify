import { TIMEOUT_SEC } from './config.js'

// 設定計時器，如果 fetch 執行時間過長，回傳 rejected promise
const timeout = (second) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${second} second`))
    }, second * 1000)
  })

export const getJSON = async (url) => {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)])
    const data = await response.json()

    if (!response.ok) throw new Error(`${data.message}(${response.status})`)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
