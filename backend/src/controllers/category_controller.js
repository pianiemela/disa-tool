const router = require('express').Router()

const categoryService = require('../services/category_service.js')

router.get('/', async (req, res) => {
    const categories = []
    if (req.query) {
        categories.push(await categoryService.getCourseCategories(req.query.course))
    } else {
        categories.push(await categoryService.getAllCategories())
    }
    res.status(200).json(categories)
})

module.exports = router
