import React from 'react'
import { CreateObjectiveForm } from '../../../../../containers/Course/components/matrix/CreateObjectiveForm'
import ModalForm from '../../../../../utils/components/ModalForm'
import { findText } from '../../../../testUtils'

const category = {
  id: 3,
  name: 'Test Category'
}
const level = {
  id: 5,
  name: 'Test Level'
}
const mockFn = () => {}

describe('CreateObjectiveForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CreateObjectiveForm
      addObjective={mockFn}
      category={category}
      level={level}
      courseId={1}
      moveObjective={mockFn}
      translate={() => ''}
      newOrder={1}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.CreateObjectiveForm').exists()).toEqual(true)
  })

  describe('form content', () => {
    let content

    beforeEach(() => {
      try {
        content = wrapper.find(ModalForm).props().children.map(child => shallow(child))
      } catch (e) {
        content = [shallow(wrapper.find(ModalForm).props().content)]
      }
    })

    it('renders category name.', () => {
      expect((
        content.reduce((acc, curr) => acc + findText(category.name, curr), 0)
      )).toBeGreaterThan(0)
    })

    it('renders level name.', () => {
      expect((
        content.reduce((acc, curr) => acc + findText(level.name, curr), 0)
      )).toBeGreaterThan(0)
    })
  })

  describe('ModalForm onSubmit', () => {
    it('is a function.', () => {
      expect(typeof wrapper.find(ModalForm).props().onSubmit).toEqual('function')
    })
  })
})
