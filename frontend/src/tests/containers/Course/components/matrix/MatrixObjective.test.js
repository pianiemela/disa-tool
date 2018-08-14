import React from 'react'
import { MatrixObjective } from '../../../../../containers/Course/components/matrix/MatrixObjective'
import DeleteForm from '../../../../../utils/components/DeleteForm'

const objective = {
  id: 1,
  name: 'Test objective',
  task_count: 0
}

describe('MatrixObjective component', () => {
  let wrapper
  let removeObjective
  let toggleObjective

  beforeEach(() => {
    removeObjective = jest.fn()
    toggleObjective = jest.fn()
    wrapper = shallow(<MatrixObjective
      objective={objective}
      editing={false}
      removeObjective={removeObjective}
      active={false}
      toggleObjective={toggleObjective}
      activeTaskId={null}
      details={() => {}}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixObjective').exists()).toEqual(true)
  })

  // it('renders objective name', () => {
  //   expect(findText(objective.name, wrapper)).toBeGreaterThan(0)
  // })

  describe('when not editing', () => {
    it('does not render a DeleteForm component.', () => {
      expect(wrapper.find(DeleteForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
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

  describe('when in task editing view', () => {
    beforeEach(() => {
      wrapper.setProps({
        showDetails: true
      })
    })

    describe('when activeTaskId is null', () => {
      it('does not call toggleObjective prop when clicked.', () => {
        wrapper.find('.objectiveButton').prop('onClick')()
        expect(toggleObjective).not.toHaveBeenCalled()
      })
    })

    describe('when activeTaskId is not null', () => {
      beforeEach(() => {
        wrapper.setProps({
          activeTaskId: 3
        })
      })

      it('calls toggleObjective prop when clicked.', () => {
        wrapper.find('.objectiveButton').prop('onClick')()
        expect(toggleObjective).toHaveBeenCalledWith({
          task_id: 3,
          objective_id: objective.id
        })
      })
    })

    describe('when not active', () => {
      it('does not highlight button.', () => {
        expect(wrapper.find('.objectiveButton').prop('active')).toEqual(false)
      })
    })

    describe('when active', () => {
      beforeEach(() => {
        wrapper.setProps({
          active: true
        })
      })

      it('is coloured.', () => {
        expect(wrapper.find('.objectiveButton').prop('active')).toEqual(true)
      })
    })
  })
})
