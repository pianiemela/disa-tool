export default action => (item) => {
  switch (item.id) {
    case action.drag.id:
      return {
        ...item,
        order: action.hover.order
      }
    case action.hover.id:
      return {
        ...item,
        order: action.drag.order
      }
    default:
      return item
  }
}
