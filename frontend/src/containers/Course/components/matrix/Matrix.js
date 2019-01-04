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
  const categoriesNode = categories.map((category, index, categoryArray) => {
    const slots = {
      previous: index > 0 ? (
        (category.order + categoryArray[index - 1].order) / 2
      ) : category.order - 1,
      next: index < categoryArray.length - 1 ? (
        (category.order + categoryArray[index + 1].order) / 2
      ) : category.order + 1
    }
    if (index === categoryArray.length - 1) { newCategoryOrder = slots.next }
    return (
      <MatrixCategory
        key={category.id}
        category={category}
        courseId={props.courseId}
        editing={props.editing}
        activeMap={activeMap}
        activeTaskId={activeTaskId}
        showDetails={props.showDetails}
        slots={slots}
      />
    )
  })
  const levels = props.levels.sort((a, b) => a.order - b.order)
  let newLevelOrder = 1
  const levelsNode = levels.map((level, index, levelArray) => {
    const slots = {
      previous: index > 0 ? (
        (level.order + levelArray[index - 1].order) / 2
      ) : level.order - 1,
      next: index < levelArray.length - 1 ? (
        (level.order + levelArray[index + 1].order) / 2
      ) : level.order + 1
    }
    if (index === levelArray.length - 1) { newLevelOrder = slots.next }
    return (
      <HeaderLevel key={level.id} level={level} editing={props.editing} slots={slots} />
    )
  })
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
            {levelsNode}
            {props.editing ? (
              <CreateLevelForm courseId={props.courseId} newOrder={newLevelOrder} />
            ) : (
                null
              )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {categoriesNode}
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
