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

axios.defaults.headers.common.credentials = 'same-origin'


const getAuthAndParams = (params, privileges) => (
  {
    headers: {
      Authorization: getAuthorization()
    },
    params: {
      ...params,
      lang: getLanguage(),
      privileges: privileges.join(',')
    }
  }
)

export const getJson = (path, params, privileges = []) => axios.get(
  `${BASE_PATH}${path}`,
  getAuthAndParams(params, privileges)
)

export const postJson = (path, data, privileges = []) => axios.post(
  `${BASE_PATH}${path}`,
  data,
  getAuthAndParams(privileges)
)

export const putJson = (path, data, privileges = []) =>
  axios.put(
    `${BASE_PATH}${path}`,
    data,
    getAuthAndParams(null, privileges)
  )


export const deleteCall = (path, privileges = []) => axios.delete(
  `${BASE_PATH}${path}`,
  getAuthAndParams(privileges)
)
