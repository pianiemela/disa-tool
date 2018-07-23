import React from 'react'
import { MatrixObjective } from '../../../../../containers/EditMatrix/components/matrix/MatrixObjective'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import { findText } from '../../../../testUtils'

const objective = {
  id: 1,
  name: 'Test objective'
}

describe('MatrixObjective component', () => {
  let wrapper
  let removeObjective

  beforeEach(() => {
    removeObjective = jest.fn()
    wrapper = shallow(<MatrixObjective
      objective={objective}
      editing={false}
      removeObjective={removeObjective}
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

    describe('DeleteForm component', () => {
      let deleteForm
      beforeEach(() => {
        deleteForm = wrapper.find(DeleteForm)
      })

      it('includes objective names in prompt.', () => {
        const prompt = deleteForm.prop('prompt')
        expect(prompt.filter(segment => segment.includes(objective.name)).length).toBeGreaterThan(0)
      })

      it('gets the removeObjective prop as part of onExecute.', () => {
        deleteForm.prop('onExecute')()
        expect(removeObjective).toHaveBeenCalled()
      })
    })
  })
})
