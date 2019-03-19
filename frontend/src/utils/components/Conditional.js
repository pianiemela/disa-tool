import PropTypes from 'prop-types'

export const Conditional = ({ visible, children }) => {
  if (!visible) return null
  return children
}

Conditional.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
}

Conditional.defaultProps = {
  render: null,
  children: null
}

export default Conditional
