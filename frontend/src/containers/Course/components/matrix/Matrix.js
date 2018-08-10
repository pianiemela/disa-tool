import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Header, Table, Button, Container } from 'semantic-ui-react'
import './matrix.css'
import asyncAction from '../../../../utils/asyncAction'

import { removeLevel } from '../../actions/levels'
import { changeActive } from '../../actions/tasks'

import MatrixCategory from './MatrixCategory'
import CreateCategoryForm from './CreateCategoryForm'
import CreateLevelForm from './CreateLevelForm'
import DeleteForm from '../../../../utils/components/DeleteForm'

export const Matrix = (props) => {
  const handleCourseChange = (e, { value }) => {
    props.dispatchChangeTask(value)
  }

  // TODO: This should not be needed anymore, all tasks should have an up-to-date defaultMultiplier
  // Keeping this for now, just in case.
  const calculateMultiplier = (activeTask) => {
    const types = props.types.headers.map(header =>
      header.types.find(type => activeTask.types.includes(type.id)))
    const filtered = types.filter(type => type !== undefined && type.multiplier)
    console.log(filtered, types)
    return filtered.reduce((acc, curr) => acc * curr.multiplier, 1)
  }

  const activeMap = {}
  let activeTaskId = null
  if (props.activeTask !== null) {
    activeTaskId = props.activeTask.id
    props.activeTask.objectives.forEach((objective) => {
      activeMap[objective.id] = true
    })
  }
  // console.log(props)
  return (
    <Container>
      <Header as="h2">
        <Dropdown
          fluid
          options={props.tasks.map(task => ({ key: task.id, text: task.name, value: task.id }))}
          placeholder="Valitse tehtävä tästä"
          scrolling
          search
          selectOnBlur={false}
          value={props.activeTask ? props.activeTask.id : null}
          onChange={handleCourseChange}
        />
        <Header.Subheader>Kerroin:
          {props.activeTask ?
            <Button
              basic
              content={props.activeTask.defaultMultiplier ?
                props.activeTask.defaultMultiplier : calculateMultiplier(props.activeTask)}
            />
            : undefined}
        </Header.Subheader>
      </Header>
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
              activeTaskId={activeTaskId}
            />
          ))}
          {props.editing ? (
            <CreateCategoryForm courseId={props.courseId} />
          ) : (
            <Table.Row />
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
  })
}

Matrix.defaultProps = {
  courseId: null,
  activeTask: null
}

const mapStateToProps = state => ({
  categories: state.category.categories,
  levels: state.level.levels,
  activeTask: state.task.active === null ? (
    null
  ) : (
    state.task.tasks.find(task => task.id === state.task.active)
  ),
  tasks: state.task.tasks,
  types: state.type
})

const mapDispatchToProps = dispatch => ({
  // TODO: refactor to pass actions as parameters to dispatch (i.e. dispatch(action)),
  // not the other way around as these are now.
  removeLevel: asyncAction(removeLevel, dispatch),
  dispatchChangeTask: changeActive(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Matrix)
