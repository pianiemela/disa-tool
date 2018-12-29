import React from 'react'
import { DropTarget, DragSource } from 'react-dnd'

const DnDItem = ({ connectDropTarget, connectDragSource, isDragging, children }) => (
  connectDropTarget(connectDragSource((
    <div style={{ opacity: isDragging ? 0 : 1 }}>
      {children}
    </div>
  )))
)

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

const defineItem = type => DropTarget(type, dropSpec, dropCollect)((
  DragSource(type, dragSpec, dragCollect)(DnDItem)
))

export default defineItem
