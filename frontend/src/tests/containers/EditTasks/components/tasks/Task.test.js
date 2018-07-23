import React from 'react'
import { Task } from '../../../../../containers/EditTasks/components/tasks/Task'
import TaskTypelist from '../../../../../containers/EditTasks/components/tasks/TaskTypelist'
import TaskObjectivelist from '../../../../../containers/EditTasks/components/tasks/TaskObjectivelist'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import { findText } from '../../../../testUtils'

const task = {
  id: 1,
  name: 'Tehtävä 1. (Tee voltti)',
  description: 'Tässä tehtävässä sinun tulee tehdä voltti, eli hypätä ja pyörähtää täysi kierros sivuttaisakselisi ympäri.',
  max_points: 3,
  info: 'tehtäväsivu: https://fi.wikipedia.org/wiki/Voltti_(akrobatia)',
  objectives: [
    {
      id: 1,
      name: 'Osaan muokata yhtälöryhmää vastaavan matriisin alkeisrivitoimituksilla redusoiduksi porrasmatriisiksi',
      multiplier: 0.5
    },
    {
      id: 2,
      name: 'Osaan päätellä yhtälöryhmän ratkaisut redusoidusta porrasmatriisista',
      multiplier: 0.8
    },
    {
      id: 3,
      name: 'Tunnen lineaarisen yhtälöryhmän ratkaisujen lukumäärään liittyvät rajoitukset',
      multiplier: 1.0
    }
  ],
  types: [
    {
      id: 1,
      name: 'Viikko 1'
    },
    {
      id: 7,
      name: 'Sarja I'
    }
  ]
}
const mockFn = () => {}

describe('Task component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Task
      task={task}
      editing={false}
      removeTask={mockFn}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Task').exists()).toEqual(true)
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

  describe('when collapsed', () => {
    it('does not render task description.', () => {
      expect(findText(task.description, wrapper)).toEqual(0)
    })

    it('does not render task info.', () => {
      expect(findText(task.info, wrapper)).toEqual(0)
    })

    it('does not render a TaskTypelist component.', () => {
      expect(wrapper.find(TaskTypelist).exists()).toEqual(false)
    })

    it('does not render a TaskObjectivelist component.', () => {
      expect(wrapper.find(TaskObjectivelist).exists()).toEqual(false)
    })
  })

  describe('when expanded', () => {
    beforeEach(() => {
      wrapper.setState({
        expanded: true
      })
    })

    it('renders task description.', () => {
      expect(findText(task.description, wrapper)).toBeGreaterThan(0)
    })

    it('renders task info.', () => {
      expect(findText(task.info, wrapper)).toBeGreaterThan(0)
    })

    it('renders a TaskTypelist component.', () => {
      expect(wrapper.find(TaskTypelist).exists()).toEqual(true)
    })

    it('renders a TaskObjectivelist component.', () => {
      expect(wrapper.find(TaskObjectivelist).exists()).toEqual(true)
    })
  })
})
