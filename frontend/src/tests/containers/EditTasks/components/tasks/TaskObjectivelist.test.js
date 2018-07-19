import React from 'react'
import TaskObjectivelist from '../../../../../containers/EditTasks/components/tasks/TaskObjectivelist'
import TaskObjective from '../../../../../containers/EditTasks/components/tasks/TaskObjective'
import AddObjectiveForm from '../../../../../containers/EditTasks/components/tasks/AddObjectiveForm'

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

describe('TaskObjectivelist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskObjectivelist
      task={task}
      editing={false}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.TaskObjectivelist').exists()).toEqual(true)
  })

  it('renders a TaskObjective component for each objective.', () => {
    expect(wrapper.find(TaskObjective).length).toEqual(task.objectives.length)
  })

  describe('when not editing', () => {
    it('does not render an AddObjectiveForm component.', () => {
      expect(wrapper.find(AddObjectiveForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        ...wrapper.props(),
        editing: true
      })
    })

    it('renders an AddObjectiveForm component.', () => {
      expect(wrapper.find(AddObjectiveForm).exists()).toEqual(true)
    })
  })
})
