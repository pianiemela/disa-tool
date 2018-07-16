import React from 'react'
import { Button } from 'semantic-ui-react'
import { CourseHeader } from '../../../../../containers/Course/components/header/CourseHeader'
import { findText } from '../../../../testUtils'

const courseName = 'Test Course'

describe('CourseHeader component', () => {
  let wrapper
  let setEditing

  beforeEach(() => {
    setEditing = jest.fn()
    wrapper = shallow(<CourseHeader
      courseName={courseName}
      editing={false}
      setEditing={setEditing}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CourseHeader').exists()).toEqual(true)
  })

  it('renders course name.', () => {
    const headerBlock = wrapper.find('.headerBlock')
    expect(findText(courseName, headerBlock)).toBeGreaterThan(0)
  })

  describe('edit button', () => {
    it('renders a button.', () => {
      const editButton = wrapper.find('.editBlock').find(Button)
      expect(editButton.exists()).toEqual(true)
    })

    describe('while not editing', () => {
      it('calls props.setEditing with correct value when edit button is clicked.', () => {
        const editButton = wrapper.find('.editBlock').find(Button)
        editButton.props().onClick()
        expect(setEditing).toHaveBeenCalledWith({ value: true })
      })
    })

    describe('while editing', () => {
      beforeEach(() => {
        wrapper.setProps({
          ...wrapper.props(),
          editing: true
        })
      })

      it('calls props.setEditing with correct value when edit button is clicked.', () => {
        const editButton = wrapper.find('.editBlock').find(Button)
        editButton.props().onClick()
        expect(setEditing).toHaveBeenCalledWith({ value: false })
      })
    })
  })
})
