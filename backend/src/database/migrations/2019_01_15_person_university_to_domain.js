
const defaults = {
  old: 'University of Helsinki',
  new: 'helsinki.fi'
}

module.exports = {
  up: (queryInterface, Sequelize, done) => {
    Promise.all([
      queryInterface.changeColumn(
        'person',
        'university',
        {
          type: Sequelize.STRING,
          defaultValue: defaults.new,
          allowNull: false
        }
      ),
      queryInterface.sequelize.query(
        `UPDATE Person SET university='${defaults.new}' WHERE university='${defaults.old}';`
      )
    ]).then(() => done())
  },
  down: (queryInterface, Sequelize, done) => {
    Promise.all([
      queryInterface.changeColumn(
        'person',
        'university',
        {
          type: Sequelize.STRING,
          defaultValue: defaults.old,
          allowNull: false
        }
      ),
      queryInterface.sequelize.query(
        `UPDATE Person SET university='${defaults.old}' WHERE university='${defaults.new}';`
      )
    ]).then(() => done())
  }
}
