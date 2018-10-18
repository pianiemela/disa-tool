const router = require('express').Router()
const logger = require('../utils/logger')
const typeService = require('../services/type_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')
const editRoutes = require('../utils/editRoutes')

const messages = {
  create: {
    eng: '"Tyyppi luotu onnistuneesti." englanniksi.',
    fin: 'Tyyppi luotu onnistuneesti.',
    swe: '"Tyyppi luotu onnistuneesti." ruotsiksi.'
  },
  delete: {
    eng: '"Tyyppi poistettu onnistuneesti." englanniksi.',
    fin: 'Tyyppi poistettu onnistuneesti.',
    swe: '"Tyyppi poistettu onnistuneesti." ruotsiksi.'
  },
  createHeader: {
    eng: '"Tyyppiotsake luotu onnistuneesti." englanniksi.',
    fin: 'Tyyppiotsake luotu onnistuneesti.',
    swe: '"Tyyppiotsake luotu onnistuneesti." ruotsiksi.'
  },
  deleteHeader: {
    eng: '"Tyyppiotsake poistettu onnistuneesti." englanniksi.',
    fin: 'Tyyppiotsake poistettu onnistuneesti.',
    swe: '"Tyyppiotsake poistettu onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Tyypin tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Tyypin tiedot haettu onnistuneesti.',
    swe: '"Tyypin tiedot haettu onnistuneesti." ruotsiksi.'
  },
  edit: {
    eng: '"Tyypin muutokset tallennettu onnistuneesti." englanniksi.',
    fin: 'Tyypin muutokset tallennettu onnistuneesti.',
    swe: '"Tyypin muutokset tallennettu onnistuneesti." ruotsiksi.'
  },
  headerDetails: {
    eng: '"Tyyppiotsakkeen tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Tyyppiotsakkeen tiedot haettu onnistuneesti.',
    swe: '"Tyyppiotsakkeen tiedot haettu onnistuneesti." ruotsiksi.'
  },
  headerEdit: {
    eng: '"Tyyppiotsake muokattu onnistuneesti." englanniksi.',
    fin: 'Tyyppiotsake muokattu onnistuneesti.',
    swe: '"Tyyppiotsake muokattu onnistuneesti." ruotsiksi.'
  },
  getByCourse: {
    eng: '"Tyypit haettu onnistuneesti." englanniksi.',
    fin: 'Tyypit haettu onnistuneesti.',
    swe: '"Tyypit haettu onnistuneesti." ruotsiksi.'
  }
}

router.post('/create', async (req, res) => {
  const { instance: toCreate, header } = await typeService.create.prepare(req.body)
  if (!await checkPrivilege(
    req,
    [
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: header.course_instance_id
      }
    ]
  )) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  await typeService.create.execute(toCreate)
  const created = typeService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await typeService.delete.prepare(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: errors.notfound[req.lang]
    })
    return
  }
  if (!await checkPrivilege(
    req,
    [
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: toDelete.dataValues.type_header.course_instance_id
      }
    ]
  )) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const deleted = typeService.delete.value(toDelete)
  typeService.delete.execute(toDelete)
  res.status(200).json({
    message: messages.delete[req.lang],
    deleted
  })
})

router.post('/headers/create', async (req, res) => {
  try {
    const toCreate = typeService.createHeader.prepare(req.body)
    if (!await checkPrivilege(
      req,
      [
        {
          key: 'logged_in'
        },
        {
          key: 'teacher_on_course',
          param: toCreate.dataValues.course_instance_id
        }
      ]
    )) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    await typeService.createHeader.execute(toCreate)
    const created = typeService.createHeader.value(toCreate, req.lang)
    res.status(200).json({
      message: messages.createHeader[req.lang],
      created
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

router.delete('/headers/:id', async (req, res) => {
  try {
    const toDelete = await typeService.deleteHeader.prepare(req.params.id)
    if (!toDelete) {
      res.status(404).json({
        error: errors.notfound[req.lang]
      })
      return
    }
    if (!await checkPrivilege(
      req,
      [
        {
          key: 'logged_in'
        },
        {
          key: 'teacher_on_course',
          param: toDelete.dataValues.course_instance_id
        }
      ]
    )) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    const deleted = typeService.deleteHeader.value(toDelete)
    typeService.deleteHeader.execute(toDelete)
    res.status(200).json({
      message: messages.deleteHeader[req.lang],
      deleted
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

editRoutes(router, {
  service: typeService,
  messages,
  errors,
  pathToCourseInstanceId: ['type_header', 'course_instance_id']
})

editRoutes(router, {
  service: typeService.headerEdit,
  messages: {
    details: messages.headerDetails,
    edit: messages.headerEdit
  },
  errors,
  route: '/headers'
})

router.get('/course/:id', async (req, res) => {
  try {
    const data = await typeService.getByCourse(req.params.id, req.lang)
    res.status(200).json({
      message: messages.getByCourse[req.lang],
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

module.exports = router
