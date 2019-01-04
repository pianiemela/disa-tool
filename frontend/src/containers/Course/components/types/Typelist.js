import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Type, { dropSpec } from './Type'
import CreateTypeForm from './CreateTypeForm'
import { editType } from '../../actions/types'
import dndItem from '../../../../utils/components/DnDItem'
import asyncAction from '../../../../utils/asyncAction'

const DnDItem = dndItem('type', {
  dropSpec: {
    drop: (props, monitor) => {
      const { element } = props
      const drag = monitor.getItem()
      if (element.type_header_id === drag.type_header_id) { return }
      dropSpec.drop(props, monitor)
    }
  }
})

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
        <DnDItem
          element={{
            order: newOrder,
            type_header_id: props.headerId
          }}
          mover={props.moveType}
        >
          <CreateTypeForm headerId={props.headerId} newOrder={newOrder} />
        </DnDItem>
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
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  moveType: PropTypes.func.isRequired
}

Typelist.defaultProps = {
  activeTaskId: null
}

const mapDispatchToProps = dispatch => ({
  moveType: asyncAction(editType, dispatch)
})

export default connect(null, mapDispatchToProps)(Typelist)
