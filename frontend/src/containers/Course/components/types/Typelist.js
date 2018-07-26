import React from 'react'
import PropTypes from 'prop-types'

import Type from './Type'
import CreateTypeForm from './CreateTypeForm'

export const Typelist = props => (
  <div className="Typelist">
    {props.types.map(type => (<Type
      key={type.id}
      type={type}
      editing={props.editing}
    />))}
    {props.editing ? (
      <CreateTypeForm headerId={props.headerId} />
    ) : (
      null
    )}
  </div>
)

Typelist.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  headerId: PropTypes.number.isRequired
}

export default Typelist
