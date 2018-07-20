import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

import MatrixLevel from './MatrixLevel'
import RemoveCategoryForm from './RemoveCategoryForm'

export const MatrixCategory = props => (
  <Table.Row className="MatrixCategory">
    <Table.Cell>
      {props.category.name}
      {props.editing ? (
        <RemoveCategoryForm category={props.category} />
      ) : (
        <div />
      )}
    </Table.Cell>
    {props.category.skill_levels.map(level => (
      <MatrixLevel
        key={level.id}
        category={props.category}
        level={level}
        courseId={props.courseId}
        editing={props.editing}
      />
    ))}
  </Table.Row>
)

MatrixCategory.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    skill_levels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  courseId: PropTypes.number.isRequired,
  editing: PropTypes.bool.isRequired
}

export default MatrixCategory
