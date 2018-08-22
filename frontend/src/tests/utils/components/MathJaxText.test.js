import React from 'react'
import MathJax from 'react-mathjax'
import MathJaxText from '../../../utils/components/MathJaxText'
import { findText } from '../../testUtils'

const content = 'text text $ e = mc^2 $ more text $ a = %% a %% $ final %% text %%.'
const delimiters = ['$']

describe('MathJaxText component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MathJaxText
      content={content}
      delimiters={delimiters}
    />)
  })
  it('renders spans.', () => {
    expect(wrapper.find('span').length).toEqual(3 + 1)
  })

  it('renders MathJax.Nodes.', () => {
    expect(wrapper.find(MathJax.Node).length).toEqual(2)
  })

  it('renders plain text plainly.', () => {
    content.split(/\$.+\$/).forEach(text => expect(findText(text, wrapper)).toBeGreaterThan(0))
  })

  it('does not render delimited text plainly.', () => {
    content.split('$').forEach((text, i) => {
      if (i % 2 === 0) return
      expect(findText(text, wrapper)).toEqual(0)
    })
  })

  it('renders delimited text as MathJax.Node formulae.', () => {
    const formulae = wrapper.find(MathJax.Node).map(element => element.prop('formula'))
    content.split('$').forEach((text, i) => {
      if (i % 2 === 0) return
      expect(formulae).toContainEqual(text)
    })
  })

  it('does not render delimiters.', (done) => {
    const formulae = wrapper.find(MathJax.Node).map(element => element.prop('formula'))
    formulae.forEach((formula) => {
      if (formula.includes(delimiters[0])) done('MathJax.Node element rendered delimiter.')
    })
    const foundDelimiters = findText(delimiters[0], wrapper)
    if (foundDelimiters > 0) done(`span elements rendered ${foundDelimiters} delimiters. Expected 0.`)
    done()
  })

  describe('when delimiters are left unclosed', () => {
    beforeEach(() => {
      wrapper.setProps({
        content: 'text text $ e = mc^2 $ more text $ a = a final text.'
      })
    })

    it('renders the unclosed delimiter as is.', () => {
      expect(wrapper.find('span').length).toEqual(2 + 1)
      expect(wrapper.find(MathJax.Node).length).toEqual(1)
      expect(findText(delimiters[0], wrapper)).toBeGreaterThan(0)
    })
  })

  describe('with multiple delimiters', () => {
    beforeEach(() => {
      wrapper.setProps({
        delimiters: delimiters.concat(['%%'])
      })
    })

    it('Only splits outside earlier mathjax blocks.', () => {
      const formulae = wrapper.find(MathJax.Node).map(element => element.prop('formula'))
      const found = formulae.reduce((acc, curr) => acc + (curr.split('%%').length - 1), 0)
      expect(found).toEqual(2)
    })

    it('Renders mathjax blocks for all delimiters.', () => {
      const formulae = wrapper.find(MathJax.Node).map(element => element.prop('formula'))
      content.split('$').forEach((text, i) => {
        if (i % 2 === 0) {
          text.split('%%').forEach((text2, i2) => {
            if (i2 % 2 === 0) return
            expect(formulae).toContainEqual(text2)
          })
        } else {
          expect(formulae).toContainEqual(text)
        }
      })
    })
  })
})
