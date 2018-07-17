import axios from 'axios'

export const BASE_PATH = '/api'

export const getToken = () => {
  const token = localStorage.getItem('token')
  // console.log(token)
  return token
}

const getAuthorization = () => {
  const token = getToken()
  if (token) {
    return `Bearer ${token}`
  }
  return null
}

export const getLanguage = () => {
  const language = localStorage.getItem('lang')
  // console.log(language)
  return language
}

export const saveToken = (token) => {
  try {
    localStorage.setItem('token', token)
    return token
  } catch (e) {
    return null
  }
}

export const saveLanguage = (lang) => {
  try {
    localStorage.setItem('lang', lang)
    return lang
  } catch (e) {
    return null
  }
}

export const getJson = (path, params) => axios.get(`${BASE_PATH}${path}`, {
  headers: {
    credentials: 'same-origin',
    Authorization: getAuthorization()
  },
  params: { ...params, lang: getLanguage() }
})

export const postJson = (path, data) => axios.post(`${BASE_PATH}${path}`, data, {
  headers: {
    credentials: 'same-origin',
    Authorization: getAuthorization()
  },
  params: {
    lang: getLanguage()
  }
})

export const deleteCall = path => axios.delete(`${BASE_PATH}${path}`, {
  headers: {
    credentials: 'same-origin',
    Authorization: getAuthorization()
  },
  params: {
    lang: getLanguage()
  }
})
