import React from 'react'
import { arrayOf, number, shape, string } from 'prop-types'
import { connect } from 'react-redux'
import { Label } from 'semantic-ui-react'

const SEMANTIC_GREEN = '#21ba45'

const TypesDisplay = props => (
  <div className="TypesDisplay flexContainer">
    <Label
      size="large"
      content={`${props.defaultText}: ${props.defaultMultiplier.toFixed(2)}`}
    />
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
  types: arrayOf(shape({
    id: number.isRequired,
    name: string.isRequired,
    header: string.isRequired
  })).isRequired,
  defaultText: string.isRequired,
  defaultMultiplier: number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  types: ownProps.types.map(id => findType(id, state.type.headers))
})

export default connect(mapStateToProps, null)(TypesDisplay)
