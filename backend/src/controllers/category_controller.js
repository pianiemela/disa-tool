const router = require('express').Router()

const categoryService = require('../services/category_service.js')

router.get('/', async (req, res) => {
  const { courseInstanceId } = req.query
  const categories = await categoryService.getCourseCategories(courseInstanceId, req.lang)
  res.status(200).json(categories)
})

module.exports = router
