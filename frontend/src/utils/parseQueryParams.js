const parseQueryParams = (location) => {
  if (location.search[0] !== '?') {
    return {
      ...location,
      query_params: {}
    }
  }
  const queryParams = {}
  location.search
    .substring(1, location.length)
    .split('&')
    .map(string => string.split('='))
    .forEach((param) => {
      queryParams[param[0]] = param[1] // eslint-disable-line
    })
  return {
    ...location,
    query_params: queryParams
  }
}

export default parseQueryParams
