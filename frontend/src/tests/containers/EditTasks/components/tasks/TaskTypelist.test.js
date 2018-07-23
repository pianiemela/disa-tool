import React from 'react'
import TaskTypelist from '../../../../../containers/EditTasks/components/tasks/TaskTypelist'
import TaskType from '../../../../../containers/EditTasks/components/tasks/TaskType'
import AddTypeForm from '../../../../../containers/EditTasks/components/tasks/AddTypeForm'

const task = {
  id: 1,
  name: 'Tehtävä 1. (Tee voltti)'
}
const types = [
  {
    id: 1,
    name: 'Viikko 1'
  },
  {
    id: 7,
    name: 'Sarja I'
  }
]

describe('TaskTypelist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskTypelist
      task={task}
      types={types}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.TaskTypelist').exists()).toEqual(true)
  })

  it('renders a TaskType component for each type.', () => {
    expect(wrapper.find(TaskType).length).toEqual(types.length)
  })

  describe('when not editing', () => {
    it('does not render an AddTypeForm component.', () => {
      expect(wrapper.find(AddTypeForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders an AddTypeForm component.', () => {
      expect(wrapper.find(AddTypeForm).exists()).toEqual(true)
    })
  })
})
