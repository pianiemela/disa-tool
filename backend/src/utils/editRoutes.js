/*
  To avoid copy-pasting similar code multiple times, these functions write routes for controllers.
*/

const { checkPrivilege } = require('../services/privilege')

module.exports = (router, config = {}) => {
  const {
    service,
    messages,
    errors,
    pathToCourseInstanceId = ['course_instance_id'],
    route = ''
  } = config

  router.get(`${route}/:id`, async (req, res) => {
    try {
      const data = await service.details(req.params.id)
      if (!data) {
        res.status(404).json({
          error: errors.notfound[req.lang]
        })
        return
      }
      res.status(200).json({
        message: messages.details[req.lang],
        data
      })
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
          error: e
        })
      } else {
        res.status(500).json({
          error: errors.unexpected[req.lang]
        })
        console.log(e)
      }
    }
  })

  router.put(`${route}/:id`, async (req, res) => {
    try {
      const toEdit = await service.edit.prepare(req.params.id)
      if (!toEdit) {
        res.status(404).json({
          error: errors.notfound[req.lang]
        })
        return
      }

      let courseInstanceId = toEdit.dataValues
      pathToCourseInstanceId.forEach((step) => {
        courseInstanceId = courseInstanceId[step]
      })
      if (!await checkPrivilege(req, [
        {
          key: 'teacher_on_course',
          param: courseInstanceId
        }
      ])) {
        res.status(403).json({
          error: errors.privilege[req.lang]
        })
        return
      }
      await service.edit.execute(toEdit, req.body)
      const edited = service.edit.value(toEdit, req.lang)
      res.status(200).json({
        message: messages.edit[req.lang],
        edited
      })
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
          error: e
        })
      } else {
        res.status(500).json({
          error: errors.unexpected[req.lang]
        })
        console.log(e)
      }
    }
  })
}