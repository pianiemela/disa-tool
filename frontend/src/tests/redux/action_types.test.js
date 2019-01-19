import * as types from '../../redux/action_types'

describe('Redux action types', () => {
  it('export names match type strings.', () => {
    Object.entries(types).forEach(([key, value]) => {
      expect(key).toEqual(value)
    })
  })
})
