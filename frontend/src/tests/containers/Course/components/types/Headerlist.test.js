import React from 'react'
import { Headerlist } from '../../../../../containers/Course/components/types/Headerlist'
import TypeHeader from '../../../../../containers/Course/components/types/TypeHeader'
import CreateHeaderForm from '../../../../../containers/Course/components/types/CreateHeaderForm'

const headers = [
  { id: 1 },
  { id: 2 },
  { id: 7 }
]

describe('Headerlist component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Headerlist
      headers={headers}
      editing={false}
      courseId={1}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.Headerlist').exists()).toEqual(true)
  })

  it('renders a TypeHeader component for each header.', () => {
    expect(wrapper.find(TypeHeader).length).toEqual(headers.length)
  })

  describe('when not editing', () => {
    it('does not render a CreateHeader component.', () => {
      expect(wrapper.find(CreateHeaderForm).exists()).toEqual(false)
    })
  })

  describe('when editing', () => {
    beforeEach(() => {
      wrapper.setProps({
        editing: true
      })
    })

    it('renders a CreateHeader component.', () => {
      expect(wrapper.find(CreateHeaderForm).exists()).toEqual(true)
    })
  })
})
