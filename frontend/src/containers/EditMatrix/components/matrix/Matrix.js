import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import './matrix.css'

import MatrixCategory from './MatrixCategory'
import CreateCategoryForm from './CreateCategoryForm'
import CreateLevelForm from './CreateLevelForm'

export const Matrix = props => (
  <div className="Matrix">
    <Table celled structured>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan="2">Osio</Table.HeaderCell>
          <Table.HeaderCell colSpan="3" textAlign="center">Taitotasot</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {props.levels.map(level => (
            <Table.HeaderCell key={level.id} textAlign="center">
              {level.name}
            </Table.HeaderCell>
          ))}
          <CreateLevelForm />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {props.categories.map(category => (
          <MatrixCategory
            key={category.id}
            category={category}
            courseId={props.courseId}
            editing={props.editing}
          />
        ))}
        {props.editing ? (
          <CreateCategoryForm courseId={props.courseId} />
        ) : (
          <Table.Row />
        )}
      </Table.Body>
    </Table>
  </div>
)

Matrix.propTypes = {
  courseId: PropTypes.number.isRequired,
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  editing: PropTypes.bool.isRequired
}

const mapStateToProps = state => (
  {
    categories: state.category.categories,
    levels: state.level.levels
  }
)

export default connect(mapStateToProps, null)(Matrix)
