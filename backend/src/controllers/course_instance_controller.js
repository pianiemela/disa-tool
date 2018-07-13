const router = require('express').Router()

const courseInstanceService = require('../services/course_instance_service.js')

router.get('/data/:courseInstanceId', async (req, res) => {
  const data = await courseInstanceService.getCourseInstanceData(req.params.courseInstanceId, 'fin')
  res.status(200).send(data)
})

module.exports = router
