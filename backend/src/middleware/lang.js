
const isLangCorrect = (lang) => {
  if (!lang) return false
  if (lang !== 'eng' && lang !== 'fin' && lang !== 'swe') return false
  return true
}

const validateLang = (req) => {
  if (isLangCorrect(req.query.lang)) {
    return req.query.lang
  }
  return 'fin'
}

module.exports = (req, res, next) => {
  req.lang = validateLang(req)
  next()
}
