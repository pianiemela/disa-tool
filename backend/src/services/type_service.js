const { Type } = require('../database/models.js')

const create = async (data, lang) => {
  const value = (await Type.create(data)).toJSON()
  const name = value[`${lang}_name`]
  return {
    id: value.id,
    name
  }
}

const deleteType = async (id) => {
  Type.destroy({
    where: {
      id
    }
  })
  return {
    id
  }
}

module.exports = {
  create,
  delete: deleteType
}
