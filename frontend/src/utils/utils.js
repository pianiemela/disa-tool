import axios from 'axios'

export const BASE_PATH = '/api'

export const saveLanguage = (lang) => {
  try {
    localStorage.setItem('lang', lang)
    return lang
  } catch (e) {
    return null
  }
}

export const getLanguage = () => {
  const language = localStorage.getItem('lang')
  if (!language) {
    return saveLanguage('fin')
  }
  return language
}

axios.defaults.headers.common.credentials = 'same-origin'


const getConfig = (params) => {
  const fakeUser = window.localStorage.getItem('fakeShibbo')
  const headers = fakeUser ? { uid: fakeUser } : {}

  return (
    {
      headers,
      params: {
        ...params,
        lang: getLanguage()
      }
    }
  )
}

export const getJson = (path, params) => axios.get(
  `${BASE_PATH}${path}`,
  getConfig(params)
)

export const postJson = (path, data) => axios.post(
  `${BASE_PATH}${path}`,
  data,
  getConfig(null)
)

export const putJson = (path, data) =>
  axios.put(
    `${BASE_PATH}${path}`,
    data,
    getConfig(null)
  )

export const deleteCall = path => axios.delete(
  `${BASE_PATH}${path}`,
  getConfig(null)
)
