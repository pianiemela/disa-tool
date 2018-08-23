import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Label } from 'semantic-ui-react'

const SEMANTIC_GREEN = '#21ba45'

const TypesDisplay = props => (
  <div className="TypesDisplay flexContainer">
    {props.types.map(type => (
      <Label
        key={type.id}
        basic
        size="large"
        content={`${type.header} ${type.name}`}
        style={{ color: SEMANTIC_GREEN, borderColor: SEMANTIC_GREEN }}
      />
    ))}
  </div>
)

const findType = (id, headers) => {
  let found = null
  let headerId = 0
  const typeLoop = (type) => {
    if (type.id === id) {
      found = {
        id,
        name: type.name,
        header: headers[headerId].name
      }
    }
  }
  while (!found && headerId < headers.length) {
    headers[headerId].types.forEach(typeLoop)
    headerId += 1
  }
  return found
}

TypesDisplay.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired
  })).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  types: ownProps.types.map(id => findType(id, state.type.headers))
})

export default connect(mapStateToProps, null)(TypesDisplay)
