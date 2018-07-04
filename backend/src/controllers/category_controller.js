const router = require('express').Router()

const categoryService = require('../services/category_service.js')

const isLangCorrect = (lang) => {
    if (!lang) return false
    if (lang !== 'eng' && lang !== 'fin' && lang !== 'swe') return false
    return true
}

router.get('/', async (req, res) => {
    const { lang, courseInstanceId } = req.query
    if (!isLangCorrect(lang)) {
        res.status(400).json({ error: 'Language not correctly specified' })
        return null
    }
    const categories = await categoryService.getCourseCategories(courseInstanceId, lang)
    res.status(200).json(categories)
})

module.exports = router
