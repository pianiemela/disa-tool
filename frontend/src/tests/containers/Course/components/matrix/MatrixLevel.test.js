import React from 'react'
import MatrixLevel from '../../../../../containers/Course/components/matrix/MatrixLevel'
import MatrixObjective from '../../../../../containers/Course/components/matrix/MatrixObjective'
import CreateObjectiveForm from '../../../../../containers/Course/components/matrix/CreateObjectiveForm'

const level = {
  id: 1,
  name: 'Test Level',
  objectives: [
    {
      id: 1,
      name: '1'
    },
    {
      id: 2,
      name: '2'
    },
    {
      id: 3,
      name: '3'
    }
  ]
}

describe('MatrixLevel component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MatrixLevel
      category={{}}
      level={level}
      courseId={1}
      editing={false}
      activeMap={{}}
      activeTaskId={null}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MatrixLevel').exists()).toEqual(true)
  })

  it('renders a MatrixObjective component for each objective.', () => {
    expect(wrapper.find(MatrixObjective).length).toEqual(level.objectives.length)
  })

  describe('when not editing', () => {
    it('does not render a CreateObjectiveForm component.', () => {
      expect(wrapper.find(CreateObjectiveForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        editing: true
      })
    })

    it('renders a CreateObjectiveForm component.', () => {
      expect(wrapper.find(CreateObjectiveForm).exists()).toEqual(true)
    })
  })

  describe('when a task is activated', () => {
    const activeMap = {
      1: true,
      3: true
    }

    beforeEach(() => {
      wrapper.setProps({
        activeTaskId: 4,
        activeMap
      })
    })

    it('passes the active prop to MatrixObjectives according to activeMap.', () => {
      wrapper.find(MatrixObjective).forEach((matrixObjective) => {
        const objective = matrixObjective.prop('objective')
        const active = matrixObjective.prop('active')
        expect(active).toEqual(Boolean(activeMap[objective.id]))
      })
    })
  })
})
