import React from 'react'
import { Form, Input, Label, Segment } from 'semantic-ui-react'
import MultilingualField from '../../../utils/components/MultilingualField'
import { findText } from '../../testUtils'

describe('MultilingualField component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MultilingualField
      field="test"
      fieldDisplay="test label"
      translate={() => ''}
    />)
  })

  it('renders.', () => {
    expect(wrapper.find('.MultilingualField').exists()).toEqual(true)
  })

  it('does not render a Form.', () => {
    expect(wrapper.find(Form).exists()).toEqual(false)
  })

  describe('language fields', () => {
    let engField
    let finField
    let sweField

    beforeEach(() => {
      const fields = wrapper.find(Segment).find(Form.Field)
      fields.forEach((field) => {
        const input = field.find(Input)
        switch (input.prop('name')) {
          case 'eng_test':
            engField = field
            break
          case 'fin_test':
            finField = field
            break
          case 'swe_test':
            sweField = field
            break
          default:
            throw new Error('Invalid prop "field" in MultilingualField should be "test" when testing.')
        }
      })
    })

    it('have proper labels.', () => {
      expect(findText('english', engField.find(Label))).toBeGreaterThan(0)
      expect(findText('suomi', finField.find(Label))).toBeGreaterThan(0)
      expect(findText('svenska', sweField.find(Label))).toBeGreaterThan(0)
    })
  })
})
