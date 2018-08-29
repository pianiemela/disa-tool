import React from 'react'
import { CreateHeaderForm } from '../../../../../containers/Course/components/types/CreateHeaderForm'
import ModalForm from '../../../../../utils/components/ModalForm'

const mockFn = () => {}

describe('CreateHeaderForm component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CreateHeaderForm
      addHeader={mockFn}
      courseId={1}
      translate={() => ''}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.CreateHeaderForm').exists()).toEqual(true)
  })

  describe('ModalForm onSubmit', () => {
    it('is a function.', () => {
      expect(typeof wrapper.find(ModalForm).props().onSubmit).toEqual('function')
    })
  })
})
