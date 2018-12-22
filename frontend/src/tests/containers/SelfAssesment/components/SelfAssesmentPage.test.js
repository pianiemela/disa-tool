import React from 'react'
import { Redirect } from 'react-router'
import { SelfAssessmentPage } from '../../../../containers/SelfAssessment/SelfAssessmentPage'
import EditOrNewForm from '../../../../containers/SelfAssessment/Components/EditOrNewform'

describe('Self assessment page', () => {
  let wrapper
  let dispatchGetUsercourses
  let dispatchGetUserSelfAssessments
  let dispatchGetCourseInstanceData
  let user

  beforeEach(() => {
    dispatchGetUsercourses = jest.fn()
    dispatchGetUserSelfAssessments = jest.fn()
    dispatchGetCourseInstanceData = jest.fn()

    wrapper = shallow(<SelfAssessmentPage
      match={{
        url: '/selfassessment/1',
        params: {
          courseId: '1'
        }
      }}
      user={user}
      dispatchGetUsercourses={dispatchGetUsercourses}
      dispatchGetUserSelfAssessments={dispatchGetUserSelfAssessments}
      dispatchGetCourseInstanceData={dispatchGetCourseInstanceData}
      dispatchClearError={jest.fn()}
      courses={[]}
      role="TEACHER"
      error={false}
      translate={() => ''}

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

  it('contains the self assessment create form when redirect, new and edit are false', () => {
    expect(wrapper.find(EditOrNewForm).exists()).toEqual(true)
  })

  it('calls the dispatchGetUsercourses function', () => {
    expect(dispatchGetUsercourses).toHaveBeenCalledTimes(1)
  })
  it('calls the dispatchGetUserSelfAssessments function', () => {
    expect(dispatchGetUserSelfAssessments).toHaveBeenCalledTimes(1)
  })
  it('does not call dispatchGetCourseIntanceData when user has a role prop', () => {
    expect(dispatchGetCourseInstanceData).toHaveBeenCalledTimes(0)
  })

  it('redirects when state new is true', () => {
    wrapper.setState({ new: true, courseInstanceId: 1 })
    expect(wrapper.find(Redirect).exists()).toEqual(true)
    expect(wrapper.find(Redirect).prop('to')).toEqual('/selfassessment/create/1/')
  })

  it('redirects when state edit is true', () => {
    wrapper.setState({ edit: true, redirect: true, assessmentId: 1 })
    expect(wrapper.find(Redirect).exists()).toEqual(true)
    expect(wrapper.find(Redirect).prop('to')).toEqual('/selfassessment/edit/1')
  })
})
