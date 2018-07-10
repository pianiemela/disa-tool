import React from 'react'
import { Table } from 'semantic-ui-react'
import { Matrix } from '../../../../../containers/Course/components/matrix/Matrix'
import { findText } from '../../../../testUtils'

const levels = [{
  id: 1,
  name: 'Test Level Name'
}, {
  id: 2,
  name: 'Much Longer Name Than the Other Level Name'
}]

describe('Matrix component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Matrix
      courseId={1}
      levels={levels}
      categories={[]}
      editing={false}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.Matrix').exists()).toEqual(true)
  })

  it('renders level names', () => {
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
})
