import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Container } from 'semantic-ui-react'

import './matrix.css'
import MatrixCategory from './MatrixCategory'
import CreateCategoryForm from './CreateCategoryForm'
import CreateLevelForm from './CreateLevelForm'
import HeaderLevel from './HeaderLevel'

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
  const categories = props.categories.sort((a, b) => a.order - b.order)
  let newCategoryOrder = 1
  if (categories.length > 0) {
    newCategoryOrder = categories[categories.length - 1].order + 1
  }
  const levels = props.levels.sort((a, b) => a.order - b.order)
  let newLevelOrder = 1
  if (levels.length > 0) {
    newLevelOrder = levels[levels.length - 1].order + 1
  }
  return (
    <Container>
      <Table celled structured unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>
              <span className="capitalize">{translate('category')}</span>
            </Table.HeaderCell>
            <Table.HeaderCell colSpan={levels.length + props.editing} textAlign="center">
              <span className="capitalize">{translate('skill_levels')}</span>
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {levels.map(level => (
              <HeaderLevel key={level.id} level={level} editing={props.editing} />
            ))}
            {props.editing ? (
              <CreateLevelForm courseId={props.courseId} newOrder={newLevelOrder} />
            ) : (
                null
              )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {categories.map(category => (
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
            <CreateCategoryForm
              courseId={props.courseId}
              newOrder={newCategoryOrder}
              colSpan={levels.length + 2}
            />
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

export default withLocalize(connect(mapStateToProps, null)(Matrix))
