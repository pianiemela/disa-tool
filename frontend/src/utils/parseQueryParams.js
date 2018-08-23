const parseQueryParams = (location) => {
  if (location.search[0] !== '?') {
    return {
      ...location,
      query_params: {}
    }
  }
  const queryParams = location.search
    .substring(1, location.length)
    .split('&')
    .map(string => string.split('='))
    .reduce((acc, curr) => ({
      ...acc,
      [curr[0]]: curr[1]
    }), {})
  return {
    ...location,
    query_params: queryParams
  }
}

export default parseQueryParams
