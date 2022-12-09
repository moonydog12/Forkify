import { TIMEOUT_SEC } from './config.js'

// 設定計時器，如果 fetch 執行時間過長，回傳 rejected promise
const timeout = (second) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${second} second`))
    }, second * 1000)
  })

export const AJAX = async (url, uploadData = null) => {
  try {
    let fetchPro
    if (uploadData !== null) {
      fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      })
    } else {
      fetchPro = fetch(url)
    }
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
    const data = await response.json()
    if (!response.ok) throw new Error(`${data.message}(${response.status})`)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
