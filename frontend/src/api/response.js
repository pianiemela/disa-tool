import { postJson } from '../utils/utils'

// eslint-disable-next-line import/prefer-default-export
export const create = data => postJson('/responses/create', data)
