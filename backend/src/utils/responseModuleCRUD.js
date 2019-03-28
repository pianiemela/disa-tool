const {
  Response,
  CategoryQuestion,
  ObjectiveQuestion,
  OpenQuestion,
  FinalGradeQuestion
} = require('../database/models')
const { errors } = require('../messages/global')

const respectiveQuestion = model => ({
  category_response: CategoryQuestion,
  objective_response: ObjectiveQuestion,
  open_response: OpenQuestion,
  final_grade_response: FinalGradeQuestion
}[model.name])

const responseModuleCRUD = (router, {
  model,
  route,
  messages
}) => {
  router.post(`${route}/create`, async (req, res) => {
    const inputs = req.body
    const questionModel = respectiveQuestion(model)
    const [response, question] = await Promise.all([
      Response.findByPk(inputs.response_id),
      questionModel.findByPk(inputs[`${questionModel.name}_id`])
    ])
    if (!response || !question) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    let instance
    try {
      delete inputs.id
      instance = await model.create(inputs, {
        returning: true,
        attributes: Object.keys(inputs)
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    const created = instance.toJSON()
    res.status(200).json({
      message: messages.create[req.lang],
      created
    })
  })

  router.get(`${route}/response/:id`, async (req, res) => {
    const { id } = req.params
    let response
    try {
      response = await Response.findByPk(id, {
        include: { model, required: false }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    const data = (
      model.name === 'final_grade_response'
        ? response.toJSON().final_grade_response
        // This is a hack that finds the response modules from the include field
        : Object.values(response.toJSON()).find(val => Array.isArray(val))
    )
    res.status(200).json({
      message: messages.getByResponse[req.lang],
      data
    })
  })

  router.put(`${route}/:id`, async (req, res) => {
    const { id } = req.params
    const inputs = req.body
    let instance
    try {
      instance = await model.findByPk(id, {
        include: { model: Response }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    if (instance.response.person_id !== req.user.id) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    try {
      delete inputs.id
      Object.entries(inputs).forEach(([key, value]) => {
        instance[key] = value
      })
      await instance.save()
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    const edited = instance.toJSON()
    delete edited.response
    res.status(200).json({
      message: messages.edit[req.lang],
      edited
    })
  })

  router.delete(`${route}/:id`, async (req, res) => {
    const { id } = req.params
    let instance
    try {
      instance = await model.findByPk(id, {
        include: { model: Response }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    if (instance.response.person_id !== req.user.id) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    instance.destroy()
    res.status(200).json({
      message: messages.delete[req.lang],
      deleted: { id }
    })
  })
}

module.exports = responseModuleCRUD
