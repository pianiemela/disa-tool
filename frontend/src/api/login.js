import axios from 'axios'

import { BASE_PATH } from '../utils/utils'

export const login = data => axios.post(`${BASE_PATH}/login`, data, {
  headers: {
    credentials: 'same-origin'
  }
})

export default login
