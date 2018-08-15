import { getJson } from '../utils/utils'

export const getByCourse = data => getJson(`/grades/course/${data.id}`) // eslint-disable-line
