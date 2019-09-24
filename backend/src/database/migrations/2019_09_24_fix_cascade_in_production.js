module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('ALTER TABLE category_grade DROP CONSTRAINT category_grade_category_id_fkey', { transaction })
      await queryInterface.sequelize.query('ALTER TABLE ONLY category_grade ADD CONSTRAINT category_grade_category_id_fkey FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE CASCADE', { transaction })
      await queryInterface.sequelize.query('ALTER TABLE category_grade DROP CONSTRAINT category_grade_grade_id_fkey', { transaction })
      await queryInterface.sequelize.query('ALTER TABLE ONLY category_grade ADD CONSTRAINT category_grade_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES grade(id) ON UPDATE CASCADE ON DELETE CASCADE', { transaction })
    })
  },
  down: async () => {}
}
