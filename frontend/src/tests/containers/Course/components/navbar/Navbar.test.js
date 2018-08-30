import React from 'react'
import { Navbar } from '../../../../../containers/Course/components/navbar/Navbar'

describe('Navbar component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Navbar
      matchUrl="course/12"
      pathname="course/12"
      translate={() => ''}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.Navbar').exists()).toEqual(true)
  })

  it('links to correct routes.', () => {
    expect(wrapper.find('.matrixLink').prop('to')).toEqual('course/12/matrix')
    expect(wrapper.find('.tasksLink').prop('to')).toEqual('course/12/tasks')
    expect(wrapper.find('.typesLink').prop('to')).toEqual('course/12/types')
  })

  describe('when user navigates to /matrix', () => {
    beforeEach(() => {
      wrapper.setProps({
        pathname: 'course/12/matrix'
      })
    })

    it('shows matrix tab as active.', () => {
      expect(wrapper.find('.matrixLink').prop('active')).toEqual(true)
      expect(wrapper.find('.tasksLink').prop('active')).toEqual(false)
      expect(wrapper.find('.typesLink').prop('active')).toEqual(false)
    })
  })

  describe('when user navigates to /tasks', () => {
    beforeEach(() => {
      wrapper.setProps({
        pathname: 'course/12/tasks'
      })
    })

    it('shows tasks tab as active.', () => {
      expect(wrapper.find('.matrixLink').prop('active')).toEqual(false)
      expect(wrapper.find('.tasksLink').prop('active')).toEqual(true)
      expect(wrapper.find('.typesLink').prop('active')).toEqual(false)
    })
  })

  describe('when user navigates to /types', () => {
    beforeEach(() => {
      wrapper.setProps({
        pathname: 'course/12/types'
      })
    })

    it('shows types tab as active.', () => {
      expect(wrapper.find('.matrixLink').prop('active')).toEqual(false)
      expect(wrapper.find('.tasksLink').prop('active')).toEqual(false)
      expect(wrapper.find('.typesLink').prop('active')).toEqual(true)
    })
  })
})
