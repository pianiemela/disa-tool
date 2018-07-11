import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'

describe('addObjective function', () => {
  let data

  beforeEach(() => {
    data = {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      skillLevelId: 3,
      categoryId: 7,
      courseId: 1
    }
  })

  it('returns a promise', () => {
    expect(typeof addObjective(data).then).toEqual('function')
  })
})

describe('removeObjective function', () => {
  let data

  beforeEach(() => {
    data = {
      id: 1
    }
  })

  it('returns a promise', () => {
    expect(typeof removeObjective(data).then).toEqual('function')
  })
})
