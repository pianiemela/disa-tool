import axios from 'axios'
import { saveToken, BASE_PATH } from '../../../utils/utils'

const login = dispatch => data => axios.post(`${BASE_PATH}/login`, data, {
  headers: {
    credentials: 'same-origin'
  }
}).then((res) => {
  saveToken(res.data.token)
  dispatch({
    type: 'USER_LOGIN',
    response: res.data
  })
}).catch(e => console.log(e))

module.exports = {
  login
}
