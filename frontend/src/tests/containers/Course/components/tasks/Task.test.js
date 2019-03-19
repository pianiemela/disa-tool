import React from 'react'
import { Task } from '../../../../../containers/Course/components/tasks/Task'
import DeleteForm from '../../../../../utils/components/DeleteForm'
import EditTaskForm from '../../../../../containers/Course/components/tasks/EditTaskForm'
import { findText } from '../../../../testUtils'

Task.propTypes = {}

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

describe('Task component', () => {
  let wrapper
  let removeTask
  let changeActive

  beforeEach(() => {
    removeTask = jest.fn().mockImplementation(() => Promise.resolve())
    changeActive = jest.fn()
    wrapper = shallow(<Task
      task={task}
      removeTask={removeTask}
      changeActive={changeActive}
      translate={() => ''}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.Task').exists()).toEqual(true)
  })

  it('renders a DeleteForm component.', () => {
    expect(wrapper.find(DeleteForm).exists()).toEqual(true)
  })

  describe('DeleteForm component', () => {
    let deleteForm
    beforeEach(() => {
      deleteForm = wrapper.find(DeleteForm)
    })

    it('includes task names in prompt.', () => {
      const prompt = deleteForm.prop('prompt')
      expect(prompt.filter(segment => segment.includes(task.name)).length).toBeGreaterThan(0)
    })

    it('gets the removeTypeFromTask prop as part of onExecute.', () => {
      deleteForm.prop('onExecute')()
      expect(removeTask).toHaveBeenCalled()
    })
  })

  it('renders task info.', () => {
    expect(findText(task.info, wrapper)).toBeGreaterThan(0)
  })

  describe('and editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        editing: true
      })
    })

    it('renders an EditTaskForm component.', () => {
      expect(wrapper.find(EditTaskForm).exists()).toEqual(true)
    })
  })
})
