module.exports = {
  up: (queryInterface, Sequelize, done) => {
    Promise.all([
      queryInterface.addColumn(
        'person',
        'university',
        {
          type: Sequelize.STRING,
          defaultValue: 'University of Helsinki',
          allowNull: false
        }
      ),
      queryInterface.removeConstraint(
        'person',
        'person_username_key'
      ),
      queryInterface.removeConstraint(
        'person',
        'person_studentnumber_key'
      )
    ]).then(() => {
      Promise.all([
        queryInterface.addConstraint(
          'person',
          ['university', 'username'],
          {
            type: 'unique',
            name: 'composite_unique_university_username'
          }
        ),
        queryInterface.addConstraint(
          'person',
          ['university', 'studentnumber'],
          {
            type: 'unique',
            name: 'composite_unique_university_studentnumber'
          }
        )
      ]).then(() => done())
    })
  },
  down: (queryInterface, Sequelize, done) => {
    Promise.all([
      queryInterface.removeConstraint(
        'person',
        'composite_unique_university_username'
      ),
      queryInterface.removeConstraint(
        'person',
        'composite_unique_university_studentnumber'
      )
    ]).then(() => {
      Promise.all([
        queryInterface.removeColumn(
          'person',
          'university'
        ),
        queryInterface.addConstraint(
          'person',
          ['username'],
          {
            type: 'unique',
            name: 'person_username_key'
          }
        ),
        queryInterface.addConstraint(
          'person',
          ['studentnumber'],
          {
            type: 'unique',
            name: 'person_studentnumber_key'
          }
        ),
      ]).then(() => done())
    })
  }
}
