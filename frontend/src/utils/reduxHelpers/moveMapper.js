export default action => item => (
  item.id === action.drag.id ? {
    ...item,
    order: action.drag.order
  } : item
)
