import React from 'react'
import { RemoveObjectiveForm } from '../../../../../containers/EditMatrix/components/matrix/RemoveObjectiveForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const objective = {
  id: 1,
  name: 'Test Objective'
}
const mockFn = () => {}

describe('RemoveObjectiveForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RemoveObjectiveForm
      objective={objective}
      removeObjective={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.RemoveObjectiveForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      content = shallow(wrapper.find(ModalForm).props().content)
    })

    it('renders objective name.', () => {
      expect(findText(objective.name, content)).toBeGreaterThan(0)
    })
  })
})
