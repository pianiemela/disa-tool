import axios from 'axios'

import { BASE_PATH } from '../utils/utils'

export const login = data => axios.post(`${BASE_PATH}/login`, data, {
  headers: {
    credentials: 'same-origin'
  }
})

export const shibbolethlogin = () => axios.post(`${BASE_PATH}/login/shibboleth`, {}, {
  headers: {
    credentials: 'same-origin'
  }
})
