import React from 'react'
import LoginPage from '../../../containers/Login/LoginPage'
import LoginForm from '../../../containers/Login/components/form/LoginForm'

describe('LoginPage component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<LoginPage />)
  })

  it('renders.', () => {
    expect(wrapper.find('.LoginPage').exists()).toEqual(true)
  })

  it('renders a LoginForm component.', () => {
    expect(wrapper.find(LoginForm).exists()).toEqual(true)
  })
})
