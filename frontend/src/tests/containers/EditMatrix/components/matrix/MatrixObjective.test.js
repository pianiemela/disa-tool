import React from 'react'
import { MatrixObjective } from '../../../../../containers/EditMatrix/components/matrix/MatrixObjective'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import { findText } from '../../../../testUtils'

const objective = {
  id: 1,
  name: 'Test objective'
}
const mockFn = () => {}

describe('MatrixObjective component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixObjective
      objective={objective}
      editing={false}
      removeObjective={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixObjective').exists()).toEqual(true)
  })

  it('renders objective name', () => {
    expect(findText(objective.name, wrapper)).toBeGreaterThan(0)
  })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(true)
    })
  })
})
