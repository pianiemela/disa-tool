import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Container } from 'semantic-ui-react'
import './matrix.css'
import asyncAction from '../../../../utils/asyncAction'

import { removeLevel } from '../../actions/levels'

import MatrixCategory from './MatrixCategory'
import CreateCategoryForm from './CreateCategoryForm'
import CreateLevelForm from './CreateLevelForm'
import EditLevelForm from './EditLevelForm'
import DeleteForm from '../../../../utils/components/DeleteForm'

export const Matrix = (props) => {
  const activeMap = {}
  let activeTaskId = null
  if (props.activeTask !== null) {
    activeTaskId = props.activeTask.id
    props.activeTask.objectives.forEach((objective) => {
      activeMap[objective.id] = true
    })
  }
  const translate = id => props.translate(`Course.matrix.Matrix.${id}`)

  return (
    <Container>
      <Table celled structured unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>
              <span className="capitalize">{translate('category')}</span>
            </Table.HeaderCell>
            <Table.HeaderCell colSpan={props.levels.length} textAlign="center">
              <span className="capitalize">{translate('skill_levels')}</span>
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {props.levels.map(level => (
              <Table.HeaderCell key={level.id} textAlign="center">
                {level.name}
                {props.editing ? (
                  <div className="flexContainer">
                    <div className="paddedBlock">
                      <EditLevelForm levelId={level.id} />
                    </div>
                    <div className="paddedBlock">
                      <DeleteForm
                        onExecute={() => props.removeLevel({ id: level.id })}
                        prompt={[
                          translate('delete_prompt_1'),
                          `"${level.name}"`
                        ]}
                        header={translate('delete_header')}
                      />
                    </div>
                  </div>
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
              activeTaskId={activeTaskId}
              showDetails={props.showDetails}
            />
          ))}
          {props.editing ? (
            <CreateCategoryForm courseId={props.courseId} />
          ) : (
              null
            )}
        </Table.Body>
      </Table>
    </Container>
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
    id: PropTypes.number.isRequired,
    objectives: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  showDetails: PropTypes.bool,
  translate: PropTypes.func.isRequired
}

Matrix.defaultProps = {
  courseId: null,
  activeTask: null,
  showDetails: false
}

const mapStateToProps = (state, ownProps) => ({
  categories: ownProps.categoryId ? (
    state.category.categories.filter(c => c.id === ownProps.categoryId)
  ) : state.category.categories,
  levels: state.level.levels,
  activeTask: state.task.active === null ? (
    null
  ) : (
    state.task.tasks.find(task => task.id === state.task.active)
  )
})

const mapDispatchToProps = dispatch => ({
  // TODO: refactor to pass actions as parameters to dispatch (i.e. dispatch(action)),
  // not the other way around as these are now.
  removeLevel: asyncAction(removeLevel, dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Matrix))
