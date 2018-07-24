import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import MatrixLevel from './MatrixLevel'
import DeleteForm from '../../../../utils/components/DeleteForm'
import { removeCategory } from '../../services/categories'

export const MatrixCategory = props => (
  <Table.Row className="MatrixCategory">
    <Table.Cell>
      {props.category.name}
      {props.editing ? (
        <DeleteForm
          onExecute={() => props.removeCategory({ id: props.category.id })}
          prompt={[
            'Poistetaanko kategoria',
            `"${props.category.name}"`
          ]}
          header="Poista kategoria"
        />
      ) : (
        null
      )}
    </Table.Cell>
    {props.category.skill_levels.map(level => (
      <MatrixLevel
        key={level.id}
        category={props.category}
        level={level}
        courseId={props.courseId}
        editing={props.editing}
        activeMap={props.activeMap}
      />
    ))}
  </Table.Row>
)

MatrixCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    skill_levels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  courseId: PropTypes.number,
  editing: PropTypes.bool.isRequired,
  removeCategory: PropTypes.func.isRequired,
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired
}

MatrixCategory.defaultProps = {
  courseId: null
}

const mapDispatchToProps = dispatch => ({
  removeCategory: asyncAction(removeCategory, dispatch)
})

export default connect(null, mapDispatchToProps)(MatrixCategory)
