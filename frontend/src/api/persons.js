import { getJson, postJson, putJson } from '../utils/utils'

export const getUser = () => getJson('/persons/user')

export const getUsers = data => postJson('/persons/users', data)

export const changeGlobalRole = data => putJson('/persons/global-role', data)
