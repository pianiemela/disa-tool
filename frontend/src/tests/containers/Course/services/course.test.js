import { getCourseData } from '../../../../containers/Course/services/course'

describe('getCourseData function', () => {
  let data

  beforeEach(() => {
    data = {
      courseId: 1
    }
  })

  it('returns a promise.', () => {
    expect(typeof getCourseData(data).then).toEqual('function')
  })
})
