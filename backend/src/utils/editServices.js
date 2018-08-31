/*
  To avoid copy-pasting similar code multiple times, these functions write methods for services.
*/

/**
 *
 * @param {Object} model Sequelize database model
 * @param {Object} config object with the following fields:
 * {
 *   attributes (optional): array of Sequelize attribute selectors.
 *     defaults to excluding timestamps.
 *   include (optional): include statement in Sequelize database query.
 * }
 *
 * @return {function} details function to be used by editRoutes.
 */
const details = (model, config) => id => model.findById(id, {
  attributes: config.attributes || { exclude: ['created_at', 'updated_at'] },
  include: config.include || undefined
})

/**
 * @param {Object} data object received from PUT request body or database query.
 * @param {Object} fields array of strings or arrays of strings.
 *   strings should be keys of the expected form of data.
 *   arrays should have two strings:
 *     0: object key of the expected form of data.
 *        'lang' in the key will be replaced by the lang parameter.
 *     1: object key to which the value will be mapped in the return value.
 * @param {*} lang string one of 'eng', 'fin', 'swe'
 *
 * @return {Object} data transformed to exclude fields not included in fields.
 */
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

/**
 * @param {Object} model Sequelize database model
 * @param {Object} config object with the following fields:
 * {
 *   attributes (optional): array of Sequelize attribute selectors to be used in Sequelize database query of prepare.
 *     defaults to excluding timestamps.
 *   include (optional): include statement in Sequelize database query of prepare.
 *   saveFields: see reduceFields param fields.
 *     Fields that should be passed from request body to database update query.
 *   valueFields: see reduceFields param fields.
 *     Fields that should be passed from the database query result to the response body.
 * }
 *
 * @return {Object} object with fields 'prepare', 'execute', 'value' to be used by editRoutes.
 */
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

/**
 * @param {Object} model Sequelize database model
 * @param {Object} detailsConfig see details param config
 *   Passed to details function as config
 * @param {Object} editConfig see edit param config
 *   Passed to edit function as config
 */
module.exports = (model, detailsConfig, editConfig) => ({
  details: details(model, detailsConfig),
  edit: edit(model, editConfig)
})
