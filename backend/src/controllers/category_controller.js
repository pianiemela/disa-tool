const router = require('express').Router()
const { validateLang } = require('../middleware/validate.js')

const categoryService = require('../services/category_service.js')

router.get('/', validateLang, async (req, res) => {
    const { lang, courseInstanceId } = req.query
    const categories = await categoryService.getCourseCategories(courseInstanceId, lang)
    res.status(200).json(categories)
})

module.exports = router
