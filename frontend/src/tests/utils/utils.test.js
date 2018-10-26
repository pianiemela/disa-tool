import { findPre, sortGrades, detectCycle } from '../../containers/SelfAssessmentForm/utils'

const data = [
  {
    id: 21,
    name: 'Hylätty',
    prerequisite: null
  },
  {
    id: 8,
    name: 1,
    prerequisite: 21
  },
  {
    id: 9,
    name: 2,
    prerequisite: 8
  },
  {
    id: 10,
    name: 3,
    prerequisite: 9
  },
  {
    id: 12,
    name: 4,
    prerequisite: 10
  },
  {
    id: 15,
    name: 5,
    prerequisite: 12
  }
]

describe('findPre', () => {
  const a = data[2]
  const b = data[1]


  it('returns true when a prerequisite exits', () => {

    const result = findPre(a, b, data)
    expect(result).toEqual(true)
  })

  it('returns false when there is no prerequisite', () => {
    const result = findPre(b, a, data)
    expect(result).toEqual(false)
  })

  it('returns false when looking for prerequisites of a grade without any', () => {
    const result = findPre(data[0], b, data)
    expect(result).toEqual(false)
  })

  it('returns true when checking against grade without any prerequisites ', () => {
    const result = findPre(a, data[0], data)
    expect(result).toEqual(true)
  })
  it('returns false when both grades are without prerequisites', () => {
    const result = findPre(data[0], { id: -1, prerequisite: null }, data)
    expect(result).toEqual(false)
  })
  it('return false when you compare same grades', () => {
    const result = findPre(data[0], data[0], data)
    expect(result).toEqual(false)
  })

  describe('Sort grades', () => {
    it('sorts an already ordered array', () => {
      const result = sortGrades(data)
      expect(JSON.stringify(result)).toMatch(JSON.stringify(data))
    })

    it('sorts an unordered array', () => {
      const unordered = [
        {
          id: 8,
          name: 1,
          prerequisite: 21
        },

        {
          id: 12,
          name: 4,
          prerequisite: 10
        },
        {
          id: 21,
          name: 'Hylätty',
          prerequisite: null
        },
        {
          id: 15,
          name: 5,
          prerequisite: 12
        },
        {
          id: 9,
          name: 2,
          prerequisite: 8
        },
        {
          id: 10,
          name: 3,
          prerequisite: 9
        }
      ]
      const result = sortGrades(unordered)
      expect(JSON.stringify(result)).toMatch(JSON.stringify(data))
    })

    it('sorts a reversed array', () => {
      const reversed = [
        {
          id: 15,
          name: 5,
          prerequisite: 12
        },
        {
          id: 12,
          name: 4,
          prerequisite: 10
        },
        {
          id: 10,
          name: 3,
          prerequisite: 9
        },
        {
          id: 9,
          name: 2,
          prerequisite: 8
        },
        {
          id: 8,
          name: 1,
          prerequisite: 21
        },
        {
          id: 21,
          name: 'Hylätty',
          prerequisite: null
        }
      ]
      const result = sortGrades(reversed)
      expect(JSON.stringify(result)).toMatch(JSON.stringify(data))
    })
    it('returns an empty array when called with one', () => {
      const result = sortGrades([])
      expect(result).toHaveLength(0)
    })
  })
  describe('Detect cycle', () => {
    it('returns true when there is a cycle in prerequisites', () => {

      const cyclic = [
        {
          id: 8,
          name: 1,
          prerequisite: 15
        },

        {
          id: 12,
          name: 4,
          prerequisite: 10
        },
        {
          id: 21,
          name: 'Hylätty',
          prerequisite: null
        },
        {
          id: 15,
          name: 5,
          prerequisite: 12
        },
        {
          id: 9,
          name: 2,
          prerequisite: 8
        },
        {
          id: 10,
          name: 3,
          prerequisite: 9
        }
      ]
      const result = cyclic.some(grade => detectCycle(grade, cyclic))
      expect(result).toEqual(true)
    })
    it('returns false when there is not', () => {
      const result = data.some(grade => detectCycle(grade, data))
      expect(result).toEqual(false)
    })
  })
})
