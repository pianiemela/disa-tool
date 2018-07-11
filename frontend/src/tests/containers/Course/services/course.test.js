import {
  getCourseData,
  hardCodedCategories,
  hardCodedTypes,
  hardCodedTasks,
  hardCodedLevels,
  hardCodedCourse
} from '../../../../containers/Course/services/course'
import asyncAction from '../../../../utils/asyncAction'

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

  describe('dispatch', () => {
    let withDispatch
    let dispatch

    beforeEach(() => {
      dispatch = jest.fn()
      withDispatch = asyncAction(getCourseData, dispatch)
    })

    it('is called with correct values.', async () => {
      await withDispatch(data)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'COURSE_GET_DATA',
        response: {
          data: {
            course: {
              ...hardCodedCourse,
              id: data.courseId
            },
            tasks: hardCodedTasks,
            categories: hardCodedCategories,
            types: hardCodedTypes,
            levels: hardCodedLevels
          },
          message: '<getDataForCourseSuccess>'
        }
      })
    })
  })
})
