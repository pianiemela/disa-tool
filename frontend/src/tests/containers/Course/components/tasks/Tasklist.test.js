import React from 'react'
import { Tasklist } from '../../../../../containers/Course/components/tasks/Tasklist'
import Task from '../../../../../containers/Course/components/tasks/Task'
import AddTaskForm from '../../../../../containers/Course/components/tasks/AddTaskForm'

const tasks = [
  {
    id: 1,
    name: 'Tehtävä 1. (Tee voltti)',
    description: 'Tässä tehtävässä sinun tulee tehdä voltti, eli hypätä ja pyörähtää täysi kierros sivuttaisakselisi ympäri.',
    max_points: 3,
    info: 'tehtäväsivu: https://fi.wikipedia.org/wiki/Voltti_(akrobatia)',
    objectives: [],
    types: []
  },
  {
    id: 2,
    name: 'Tehtävä 2. (Tee Muuta)',
    description: 'Tässä tehtävässä sinun tulee tehdä jotain muuta.',
    max_points: 1,
    info: 'käytä mielikuvitusta',
    objectives: [],
    types: []
  }
]

describe('Tasklist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Tasklist
      tasks={tasks}
      courseId={1}
      editing={false}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('Container').exists()).toEqual(true)
  })

  it('renders a Task component for each task.', () => {
    expect(wrapper.find(Task).length).toEqual(tasks.length)
  })

  describe('when not editing', () => {
    it('does not render an AddTaskForm component.', () => {
      expect(wrapper.find(AddTaskForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        editing: true
      })
    })
    it('renders an AddTaskForm component.', () => {
      expect(wrapper.find(AddTaskForm).exists()).toEqual(true)
    })
  })
})
