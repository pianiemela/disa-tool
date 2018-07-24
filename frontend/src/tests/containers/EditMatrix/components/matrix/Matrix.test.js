import React from 'react'
import { Table } from 'semantic-ui-react'
import { Matrix } from '../../../../../containers/EditMatrix/components/matrix/Matrix'
import MatrixCategory from '../../../../../containers/EditMatrix/components/matrix/MatrixCategory'
import { findText } from '../../../../testUtils'

const levels = [{
  id: 1,
  name: 'Test Level Name'
}, {
  id: 2,
  name: 'Much Longer Name Than the Other Level Name'
}]
const categories = [
  {
    id: 1,
    name: '1',
    skill_levels: levels.map(level => ({ id: level.id }))
  },
  {
    id: 2,
    name: '2',
    skill_levels: levels.map(level => ({ id: level.id }))
  },
  {
    id: 3,
    name: '3',
    skill_levels: levels.map(level => ({ id: level.id }))
  },
  {
    id: 4,
    name: '4',
    skill_levels: levels.map(level => ({ id: level.id }))
  }
]
const mockFn = () => {}

describe('Matrix component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Matrix
      courseId={1}
      levels={levels}
      categories={categories}
      editing={false}
      removeLevel={mockFn}
      activeTask={null}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Matrix').exists()).toEqual(true)
  })

  it('renders level names.', () => {
    const found = {}
    const search = levels.map((level) => {
      found[level.name] = false
      return level.name
    })
    wrapper.find(Table.Header).forEach((element) => {
      search.forEach((name) => {
        found[name] = found[name] || findText(name, element) > 0
      })
    })
    search.forEach((name) => {
      expect(found[name]).toEqual(true)
    })
  })

  it('renders a MatrixCategory component for each category.', () => {
    expect(wrapper.find(MatrixCategory).length).toEqual(categories.length)
  })

  describe('when a task is activated', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        activeTask: {
          id: 4,
          objectives: [{ id: 1 }, { id: 3 }]
        }
      })
    })

    it('passes the correct props to MatrixCategory components.', () => {
      wrapper.find(MatrixCategory).forEach((matrixCategory) => {
        expect(matrixCategory.prop('activeTaskId')).toEqual(4)
        expect(matrixCategory.prop('activeMap')).toEqual({
          1: true,
          3: true
        })
      })
    })
  })
})
