import axios from 'axios'
import { saveToken, BASE_PATH } from '../../../utils/utils'

const login = dispatch => data => new Promise((resolve, reject) => axios.post(`${BASE_PATH}/login`, data, {
  headers: {
    credentials: 'same-origin'
  }
}).then((res) => {
  saveToken(res.data.token)
  dispatch({
    type: 'USER_LOGIN',
    response: res.data
  })
  resolve()
}).catch((e) => {
  console.log(e)
  reject()
}))

module.exports = {
  login
}
