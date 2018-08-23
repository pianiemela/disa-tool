/*
  To avoid copy-pasting similar code multiple times, these functions write methods for services.
*/

const details = (model, config) => id => model.findById(id, {
  attributes: config.attributes || { exclude: ['created_at', 'updated_at'] },
  include: config.include || undefined
})

const reduceFields = (data, fields, lang = 'fin') => {
  if (!fields) {
    return data
  }
  const reduced = {}
  fields.forEach((field) => {
    if (Array.isArray(field)) {
      if (data[field[0].replace(/lang/, lang)] === undefined) return
      reduced[field[1]] = data[field[0].replace(/lang/, lang)]
    } else {
      if (data[field] === undefined) return
      reduced[field] = data[field]
    }
  })
  return reduced
}

const edit = (model, config) => ({
  prepare: id => model.findById(id, {
    attributes: config.attributes || { exclude: ['created_at', 'updated_at'] },
    include: config.include || undefined
  }),
  execute: (instance, data) => instance.update(reduceFields(data, config.saveFields)),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return reduceFields(json, config.valueFields, lang)
  }
})

module.exports = (model, detailsConfig, editConfig) => ({
  details: details(model, detailsConfig),
  edit: edit(model, editConfig)
})
