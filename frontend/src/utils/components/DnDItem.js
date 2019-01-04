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
    <div style={{ opacity: isDragging ? 0 : 1 }}>
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
  hover: (props, monitor, component) => {
    if (!component) { return }
    const dragOrder = monitor.getItem().order
    const hoverOrder = props.element.order
    if (dragOrder === hoverOrder) { return }
    props.mover(
      {
        id: monitor.getItem().id,
        order: dragOrder
      },
      {
        id: props.element.id,
        order: hoverOrder
      }
    )
    monitor.getItem().order = hoverOrder
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
