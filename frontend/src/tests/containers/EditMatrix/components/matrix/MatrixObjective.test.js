import React from 'react'
import MatrixObjective from '../../../../../containers/EditMatrix/components/matrix/MatrixObjective'
import RemoveObjectiveForm from '../../../../../containers/EditMatrix/components/matrix/RemoveObjectiveForm'
import { findText } from '../../../../testUtils'

const objective = {
  id: 1,
  name: 'Test objective'
}

describe('MatrixObjective component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixObjective
      objective={objective}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixObjective').exists()).toEqual(true)
  })

  it('renders objective name', () => {
    expect(findText(objective.name, wrapper)).toBeGreaterThan(0)
  })

  describe('when not editing', () => {
    it('does not render a RemoveObjectiveForm component.', () => {
      expect(wrapper.find(RemoveObjectiveForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders a RemoveObjectiveForm component.', () => {
      expect(wrapper.find(RemoveObjectiveForm).exists()).toEqual(true)
    })
  })
})
