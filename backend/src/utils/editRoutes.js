const logger = require('../utils/logger')
const { checkPrivilege } = require('../services/privilege')

/**
 * To avoid copy-pasting similar code multiple times, this function writes
 * read and update routes for controllers.
 * read route will be GET '/:id'.
 * update route will be PUT '/:id'.
 * @param {Object} router Express router that the routes should be defined in.
 * @param {Object} config Object with the following fields:
 * {
 *   service: object with the following fields:
 *     {
 *       details: async function that returns a the required details for read route.
 *       edit: object with the following fields:
 *         {
 *           prepare: async function that returns a Sequelize instance.
 *             parameters (id)
 *           execute: async function that updates database and mutates parameter instance.
 *             parameters (instance, data)
 *           value: function that returns value to be sent in response.
 *             parameters (instance, lang)
 *         }
 *     }
 *     The return value of editServices works here.
 *   messages: object with the following fields:
 *     {
 *       details: object with the following fields:
 *         {
 *           eng: read route success message in English
 *           fin: read route success message in Finnish
 *           swe: read route success message in Swedish
 *         }
 *       edit: object with the following fields:
 *         {
 *           eng: update route success message in English
 *           fin: update route success message in Finnish
 *           swe: update route success message in Swedish
 *         }
 *     }
 *   errors: object with the following fields:
 *     {
 *       notfound: object with the following fields:
 *         {
 *           eng: 404 error message in English
 *           fin: 404 error message in Finnish
 *           swe: 404 error message in Swedish
 *         }
 *       unexpected: object with the following fields:
 *         {
 *           eng: 500 error message in English
 *           fin: 500 error message in Finnish
 *           swe: 500 error message in Swedish
 *         }
 *     }
 *     messages/global.errors works here.
 *   pathToCourseInstanceId (optional): array of object keys.
 *     The keys are used to extract a course instance id from
 *     a Sequelize instance provided by service.edit.prepare dataValues.
 *     EXAMPLE:
 *       service.edit.prepare returns an instance with dataValues as follows:
 *       {
 *         category: {
 *           course_instance_id: 1
 *         }
 *       }
 *       pathToCourseInstanceId should be ['category', 'course_instance_id']
 *     The id will be used to check the teacher_on_course privilege.
 *   pathsToCourseInstanceIdMatches (optional): array of arrays of object keys.
 *     The keys are used to extract course instance ids from
 *     a Sequelize instance provided by service.edit.prepare dataValues just like pathToCoureInstanceId.
 *     The ids will be compared to the one found with pathToCourseInstanceId.
 *     If the ids don't match, privileges are denied.
 *   route (optional): string
 *     Sets route paths to `${route}/:id` instead of the default '/:id'
 * }
 */
const editRoutes = (router, config = {}) => {
  const {
    service,
    messages,
    errors,
    pathToCourseInstanceId = ['course_instance_id'],
    pathsToCourseInstanceIdMatches = [],
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
        logger.error(e)
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
      const courseInstanceIdMatch = pathsToCourseInstanceIdMatches.reduce((acc, curr) => {
        let id = toEdit.dataValues
        curr.forEach((step) => {
          id = id[step]
        })
        return id === courseInstanceId && acc
      }, true)
      if (!courseInstanceIdMatch
        || !await checkPrivilege(req, [
          {
            key: 'teacher_on_course',
            param: courseInstanceId
          }
        ])
      ) {
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
        logger.error(e)
      }
    }
  })
}

module.exports = editRoutes
