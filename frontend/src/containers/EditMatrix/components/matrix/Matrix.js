import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import './matrix.css'
import asyncAction from '../../../../utils/asyncAction'

import { removeLevel } from '../../services/levels'

import MatrixCategory from './MatrixCategory'
import CreateCategoryForm from './CreateCategoryForm'
import CreateLevelForm from './CreateLevelForm'
import DeleteForm from '../../../../utils/components/DeleteForm'

export const Matrix = (props) => {
  const activeMap = {}
  if (props.activeTask !== null) {
    props.activeTask.objectives.forEach((objective) => {
      activeMap[objective.id] = true
    })
  }
  return (
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
                {props.editing ? (
                  <DeleteForm
                    onExecute={() => props.removeLevel({ id: level.id })}
                    prompt={[
                      'Poistetaanko oppimistaso',
                      `"${level.name}"`
                    ]}
                    header="Poista oppimistaso"
                  />
                ) : (
                  null
                )}
              </Table.HeaderCell>
            ))}
            {props.editing ? (
              <CreateLevelForm courseId={props.courseId} />
            ) : (
              null
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {props.categories.map(category => (
            <MatrixCategory
              key={category.id}
              category={category}
              courseId={props.courseId}
              editing={props.editing}
              activeMap={activeMap}
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
}

Matrix.propTypes = {
  courseId: PropTypes.number,
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  activeTask: PropTypes.shape({
    objectives: PropTypes.arrayOf(PropTypes.object).isRequired
  })
}

Matrix.defaultProps = {
  courseId: null,
  activeTask: null
}

const mapStateToProps = (state, ownProps) => ({
  categories: state.category.categories,
  levels: state.level.levels,
  activeTask: ownProps.activeTask === null ? (
    null
  ) : (
    state.task.tasks.find(task => task.id === ownProps.activeTask)
  )
})

const mapDispatchToProps = dispatch => ({
  removeLevel: asyncAction(removeLevel, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Matrix)
