const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')

const messages = {
  create: {
    eng: '"Oppimistavoite luotu onnistuneesti." englanniksi.',
    fin: 'Oppimistavoite luotu onnistuneesti.',
    swe: '"Oppimistavoite luotu onnistuneesti." ruotsiksi.'
  },
  delete: {
    eng: '"Oppimistavoite poistettu onnistuneesti." englanniksi.',
    fin: 'Oppimistavoite poistettu onnistuneesti.',
    swe: '"Oppimistavoite poistettu onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Oppimistavoitteen tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Oppimistavoitteen tiedot haettu onnistuneesti.',
    swe: '"Oppimistavoitteen tiedot haettu onnistuneesti." ruotsiksi.'
  }
}

router.post('/create', async (req, res) => {
  const { instance: toCreate, category, skillLevel } = await objectiveService.create.prepare(req.body)
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
  )
  || category.course_instance_id !== toCreate.dataValues.course_instance_id
  || skillLevel.course_instance_id !== toCreate.dataValues.course_instance_id
  ) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  await objectiveService.create.execute(toCreate)
  const created = objectiveService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await objectiveService.delete.prepare(req.params.id)
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
  const deleted = objectiveService.delete.value(toDelete)
  objectiveService.delete.execute(toDelete)
  res.status(200).json({
    message: messages.delete[req.lang],
    deleted
  })
})

router.get('/:id', async (req, res) => {
  const data = await objectiveService.details(req.params.id, req.lang)
  res.status(200).json({
    message: messages.details[req.lang],
    data
  })
})

module.exports = router
