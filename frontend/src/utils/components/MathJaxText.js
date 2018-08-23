import React from 'react'
import PropTypes from 'prop-types'
import MathJax from 'react-mathjax'

const splitContent = (content, delimiter) => {
  const chunks = content
    .map((chunk, i) => (i % 2 === 0 ? chunk.split(delimiter) : [chunk]))
    .reduce((acc, curr) => acc.concat(curr), [])
  if (chunks.length % 2 === 0) {
    chunks[chunks.length - 2] = `${chunks[chunks.length - 2]}${delimiter}${chunks[chunks.length - 1]}`
    chunks.splice(chunks.length - 1, 1)
  }
  return chunks
}
const MathJaxText = (props) => {
  const chunks = props.delimiters.reduce((acc, curr) => splitContent(acc, curr), [props.content])
  const elements = chunks.map((chunk, i) => (i % 2 === 0 ? (
    <span key={i}>{chunk}</span>
  ) : (
    <MathJax.Node key={i} inline formula={chunk} />
  )))
  return (
    <span>
      {elements}
    </span>
  )
}

MathJaxText.propTypes = {
  content: PropTypes.string,
  delimiters: PropTypes.arrayOf(PropTypes.string)
}

MathJaxText.defaultProps = {
  content: '',
  delimiters: ['$']
}

export default MathJaxText
