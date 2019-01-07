const affectedTables = [
  'type_header',
  'type',
  'task',
  'objective',
  'category',
  'skill_level',
  'grade'
]

module.exports = {
  up: (queryInterface, Sequelize, done) => {
    Promise.all(
      affectedTables.map(
        table => queryInterface.addColumn(
          table,
          'order',
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
            allowNull: false
          }
        )
      )
    ).then(() => {
      Promise.all(
        affectedTables.map(
          table => queryInterface.sequelize.query(`UPDATE ${table} SET "order"=id;`)
        )
      ).then(() => done())
    })
  },
  down: (queryInterface, Sequelize, done) => {
    Promise.all(
      affectedTables.map(
        table => queryInterface.removeColumn(table, 'order')
      )
    ).then(() => done())
  }
}
