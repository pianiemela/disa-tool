const asyncAction = (promiseCreator, dispatch) =>
  data => promiseCreator(data).then(action => dispatch(action))

export default asyncAction
