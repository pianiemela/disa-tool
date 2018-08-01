import React from 'react'
import { Form } from 'semantic-ui-react'
import { CreateCoursePage } from '../../../containers/CreateCourse/CreateCoursePage'

describe('CreateCoursePage component', () => {
  let wrapper
  let createCourse

  beforeEach(() => {
    createCourse = jest.fn()
    wrapper = shallow(<CreateCoursePage
      createCourse={data => new Promise((resolve) => {
        createCourse(data)
        resolve({
          type: 'TYPE',
          response: {
            created: {
              id: 15,
              name: data.fin_name
            }
          }
        })
      })}
    />)
  })

  it('renders', () => {
    expect(wrapper.find('.CreateCoursePage').exists()).toEqual(true)
  })

  describe('when submitting the form', () => {
    beforeEach(() => {
      wrapper.find(Form).prop('onSubmit')({
        preventDefault: () => {},
        target: {
          eng_name: { value: 'en' },
          fin_name: { value: 'fn' },
          swe_name: { value: 'sn' }
        }
      })
      wrapper.update()
    })

    it('calls createCourse prop with the correct value.', () => {
      expect(createCourse).toHaveBeenCalledWith({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      })
    })

    it('redirects.', () => {
      expect(wrapper.state('redirect')).toEqual({
        id: 15,
        name: 'fn'
      })
    })
  })
})
