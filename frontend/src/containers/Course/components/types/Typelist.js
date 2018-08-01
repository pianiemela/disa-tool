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
      active={Boolean(props.activeMap[type.id])}
      activeTaskId={props.activeTaskId}
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
  headerId: PropTypes.number.isRequired,
  activeTaskId: PropTypes.number,
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired
}

Typelist.defaultProps = {
  activeTaskId: null
}

export default Typelist
