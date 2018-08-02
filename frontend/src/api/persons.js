import { getJson, postJson } from '../utils/utils'

export const getUser = () => getJson('/persons/user')
