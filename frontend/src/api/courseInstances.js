import { getJson } from '../utils/utils'

export const getData = data => getJson(`/course-instances/data/${data.id}`) // eslint-disable-line
