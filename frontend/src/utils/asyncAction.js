const asyncAction = (promiseCreator, dispatch) => {
  return data => promiseCreator(data).then(action => dispatch(action))
}

export default asyncAction