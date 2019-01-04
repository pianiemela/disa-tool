const { Type, TypeHeader, TaskType } = require('../database/models.js')
const editServices = require('../utils/editServices')

const create = {
  prepare: async (data) => {
    const instance = Type.build({
      eng_name: data.eng_name,
      fin_name: data.fin_name,
      swe_name: data.swe_name,
      type_header_id: data.type_header_id,
      multiplier: data.multiplier,
      order: data.order
    })
    const header = await TypeHeader.findById(data.type_header_id)
    return {
      instance,
      header: header.toJSON()
    }
  },
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      type_header_id: json.type_header_id,
      multiplier: json.multiplier,
      order: json.order
    }
  }
}

const deleteType = {
  prepare: id => Type.findById(id, {
    include: [
      {
        model: TaskType,
        attributes: ['task_id']
      },
      {
        model: TypeHeader,
        attributes: ['course_instance_id']
      }
    ]
  }),
  value: (instance) => {
    const json = instance.toJSON()
    const taskIds = json.task_types.map(taskType => taskType.task_id)
    return {
      id: json.id,
      type_header_id: json.type_header_id,
      task_ids: taskIds
    }
  },
  execute: instance => instance.destroy()
}

const createHeader = {
  prepare: data => TypeHeader.build({
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    course_instance_id: data.course_instance_id,
    order: data.order
  }),
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      types: [],
      order: json.order
    }
  }
}

const deleteHeader = {
  prepare: id => TypeHeader.findById(id),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id
    }
  },
  execute: instance => instance.destroy()
}

const { details, edit } = editServices(
  Type,
  {
    attributes: {
      exclude: ['updated_at', 'created_at', 'type_header_id']
    }
  },
  {
    include: {
      model: TypeHeader,
      attributes: ['id', 'course_instance_id']
    },
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name',
      'multiplier',
      'order',
      'type_header_id'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name'],
      'multiplier',
      'type_header_id',
      'order'
    ]
  },
)

const headerEdit = editServices(
  TypeHeader,
  {},
  {
    attributes: ['id', 'course_instance_id'],
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name',
      'order'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name'],
      'order'
    ]
  }
)

const getByCourse = async (id, lang) => {
  const name = [`${lang}_name`, 'name']
  const types = await Type.findAll({
    attributes: ['id', name],
    include: {
      model: TypeHeader,
      where: {
        course_instance_id: id
      },
      attributes: ['id', 'course_instance_id', name]
    }
  })
  return types.map((type) => {
    const json = type.toJSON()
    return {
      id: json.id,
      text: `${json.type_header.name} ${json.name}`
    }
  })
}

module.exports = {
  create,
  delete: deleteType,
  createHeader,
  deleteHeader,
  details,
  edit,
  headerEdit,
  getByCourse
}
