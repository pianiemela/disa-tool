
const isLangCorrect = (lang) => {
  if (!lang) return false
  if (lang !== 'eng' && lang !== 'fin' && lang !== 'swe') return false
  return true
}

const validateLang = (req, res, next) => {
  if (isLangCorrect(req.query.lang)) {
    next()
  } else {
    res.status(400).json({ error: 'Language not correctly specified' })
  }
}

module.exports = {
  validateLang
}
