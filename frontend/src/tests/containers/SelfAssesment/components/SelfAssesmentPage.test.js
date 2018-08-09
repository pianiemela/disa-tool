import React from 'react'
import { Redirect } from 'react-router'
import { SelfAssesmentPage } from '../../../../containers/SelfAssesment/SelfAssesmentPage'
import { SelfAssesmentCreateForm } from '../../../../containers/SelfAssesment/CreateForm/SelfAssesmentCreateForm'

describe('Self assesment page', () => {
  let wrapper
  let dispatchGetUsercourses
  let dispatchGetUserSelfAssesments
  let user

  beforeEach(() => {
    dispatchGetUsercourses = jest.fn()
    dispatchGetUserSelfAssesments = jest.fn()
    wrapper = shallow(<SelfAssesmentPage
      match={{
        url: '/selfAssesment',
        params: {}
      }}
      user={user}
      dispatchGetUsercourses={dispatchGetUsercourses}
      dispatchGetUserSelfAssesments={dispatchGetUserSelfAssesments}
      courses={[]}
    />)
    user = {
      id: 422,
      name: 'Terhi Testaaja',
      studentnumber: '012345688',
      role: 'Teacher'
    }
  })


  it('renders', () => {
    expect(wrapper.find('.selfAssesmentCreateForm').exists()).toEqual(true)
  })

  it('contains the self assesment create form when redirect, new and edit are false', () => {
    expect(wrapper.find(SelfAssesmentCreateForm).exists()).toEqual(true)
  })

  it('calls the dispatchGetUsercourses function', () => {
    expect(dispatchGetUsercourses).toHaveBeenCalledTimes(1)
  })
  it('calls the dispatchGetUserSelfAssements function', () => {
    expect(dispatchGetUserSelfAssesments).toHaveBeenCalledTimes(1)
  })

  it('redirects when state new is true', () => {
    wrapper.setState({ new: true, courseInstanceId: 1 })
    expect(wrapper.find(Redirect).exists()).toEqual(true)
    expect(wrapper.find(Redirect).prop('to')).toEqual('/selfassesment/create/1/')
  })

  it('redirects when state edit is true', () => {
    wrapper.setState({ edit: true, redirect: true, assesmentId: 1 })
    expect(wrapper.find(Redirect).exists()).toEqual(true)
    expect(wrapper.find(Redirect).prop('to')).toEqual('/selfassesment/edit/1')
  })
})
