import React from 'react'
import PropTypes from 'prop-types'

import Type from './Type'
import CreateTypeForm from './CreateTypeForm'

export const Typelist = (props) => {
  const types = props.types.sort((a, b) => a.order - b.order)
  let newOrder = 1
  const typesNode = types.map((type, index, typesArray) => {
    const slots = {
      previous: index > 0 ? (type.order + typesArray[index - 1].order) / 2 : type.order - 1,
      next: index < typesArray.length - 1 ? (
        (type.order + typesArray[index + 1].order) / 2
      ) : type.order + 1
    }
    if (index === typesArray.length - 1) { newOrder = slots.next }
    return (
      <Type
        key={type.id}
        type={type}
        editing={props.editing}
        active={Boolean(props.activeMap[type.id])}
        activeTaskId={props.activeTaskId}
        headerId={props.headerId}
        slots={slots}
      />
    )
  })
  return (
    <div className="Typelist">
      {typesNode}
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
