import React from 'react'
import { func, bool, node } from 'prop-types'
import { DropTarget, DragSource } from 'react-dnd'

const dummyFunc = component => component

const DnDItem = ({
  connectDropTarget,
  connectDragSource,
  isDragging,
  children
}) => (
  connectDropTarget(connectDragSource((
    <div style={{
      opacity: isDragging ? 0 : 1,
      cursor: 'move'
      }}
    >
      {children}
    </div>
  )))
)

DnDItem.propTypes = {
  connectDropTarget: func,
  connectDragSource: func,
  isDragging: bool,
  children: node
}

DnDItem.defaultProps = {
  connectDropTarget: dummyFunc,
  connectDragSource: dummyFunc,
  isDragging: false
}

const dropCollect = conn => ({
  connectDropTarget: conn.dropTarget()
})

const dragSpec = {
  beginDrag: props => ({
    id: props.element.id,
    order: props.element.order
  })
}

const dragCollect = (conn, monitor) => ({
  connectDragSource: conn.dragSource(),
  isDragging: monitor.isDragging()
})

const dropSpec = {
  drop: (props, monitor) => {
    const drag = monitor.getItem()
    const { element } = props
    let slot
    if (drag.order === element.order) {
      slot = drag.order
    } else if (drag.order > element.order) {
      slot = props.slots.previous
    } else {
      slot = props.slots.next
    }
    props.mover({
      id: drag.id,
      order: slot
    }, true)
  }
}

const defineItem = (type, config = {}) => {
  const {
    target = true,
    source = true
  } = config
  const targetFunction = target ? component => DropTarget(
    type,
    config.dropSpec || dropSpec,
    config.dropCollect || dropCollect
  )(component) : dummyFunc
  const sourceFunction = source ? component => DragSource(
    type,
    config.dragSpec || dragSpec,
    config.dragCollect || dragCollect
  )(component) : dummyFunc
  return targetFunction(sourceFunction(DnDItem))
}

export const defaults = {
  dropSpec,
  dropCollect,
  dragSpec,
  dragCollect
}

export default defineItem
