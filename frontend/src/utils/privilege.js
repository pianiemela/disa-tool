/**
 * Returns an array of privilege codes that can be parsed and checked by the backend.
 * @param {*} privilegeObjects array of objects of the following shape
 * {
 *  key: string - required
 *  param: string or convertable to string - optional
 * }
 */
const privileges = privilegeObjects => privilegeObjects.map(privilege => `${privilege.key}:${privilege.param}`)

module.exports = {
  privileges
}
