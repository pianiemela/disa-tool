module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('objective', 'fin_name', { type: Sequelize.TEXT }).then(() => (
      queryInterface.changeColumn('objective', 'eng_name', { type: Sequelize.TEXT }).then(() => (
        queryInterface.changeColumn('objective', 'swe_name', { type: Sequelize.TEXT })
      ))
    ))
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('objective', 'fin_name', { type: Sequelize.STRING }).then(() => (
      queryInterface.changeColumn('objective', 'eng_name', { type: Sequelize.STRING }).then(() => (
        queryInterface.changeColumn('objective', 'swe_name', { type: Sequelize.STRING })
      ))
    ))
  }
}
