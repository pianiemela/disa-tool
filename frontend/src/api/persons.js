import { getJson, postJson } from '../utils/utils'

export const getUser = () => getJson('/persons/user')

export const getUsers = data => postJson('/persons/users', data)
