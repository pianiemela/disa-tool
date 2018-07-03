const router = require('express').Router()

const categoryService = require('../services/category_service.js')

router.get('/', async (req, res) => {
    const categories = await categoryService.getAllCategories()
    res.status(200).json(categories)
})

module.exports = router
