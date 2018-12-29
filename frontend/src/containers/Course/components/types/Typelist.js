import React from 'react'
import PropTypes from 'prop-types'

import Type from './Type'
import CreateTypeForm from './CreateTypeForm'

export const Typelist = (props) => {
  const types = props.types.sort((a, b) => a.order - b.order)
  let newOrder = 1
  if (types.length > 0) {
    newOrder = types[types.length - 1].order + 1
  }
  return (
    <div className="Typelist">
      {types.map(type => (<Type
        key={type.id}
        type={type}
        editing={props.editing}
        active={Boolean(props.activeMap[type.id])}
        activeTaskId={props.activeTaskId}
        headerId={props.headerId}
      />))}
      {props.editing ? (
        <CreateTypeForm headerId={props.headerId} newOrder={newOrder} />
      ) : (
        null
      )}
    </div>
  )
}

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
