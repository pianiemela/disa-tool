module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('self_assessment', 'fin_instructions', { type: Sequelize.TEXT }).then(() => (
      queryInterface.changeColumn('self_assessment', 'eng_instructions', { type: Sequelize.TEXT }).then(() => (
        queryInterface.changeColumn('self_assessment', 'swe_instructions', { type: Sequelize.TEXT })
      ))
    ))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('self_assessment', 'fin_instructions', { type: Sequelize.STRING }).then(() => (
      queryInterface.changeColumn('self_assessment', 'eng_instructions', { type: Sequelize.STRING }).then(() => (
        queryInterface.changeColumn('self_assessment', 'swe_instructions', { type: Sequelize.STRING })
      ))
    ))
  }
}