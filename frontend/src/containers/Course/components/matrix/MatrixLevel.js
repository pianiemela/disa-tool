import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

import CreateObjectiveForm from './CreateObjectiveForm'
import MatrixObjective from './MatrixObjective'

const MatrixLevel = (props) => {
  const objectives = props.level.objectives.sort((a, b) => a.order - b.order)
  let newOrder = 1
  const objectivesNode = objectives.map((objective, index, objectivesArray) => {
    const slots = {
      previous: index > 0 ? (
        (objective.order + objectivesArray[index - 1].order) / 2
      ) : objective.order - 1,
      next: index < objectivesArray.length - 1 ? (
        (objective.order + objectivesArray[index + 1].order) / 2
      ) : objective.order + 1
    }
    if (index === objectivesArray.length - 1) { newOrder = slots.next }
    return (
      <MatrixObjective
        key={objective.id}
        objective={objective}
        editing={props.editing}
        active={Boolean(props.activeMap[objective.id])}
        activeTaskId={props.activeTaskId}
        showDetails={props.showDetails}
        categoryId={props.category.id}
        skillLevelId={props.level.id}
        slots={slots}
      />
    )
  })
  return (
    <Table.Cell textAlign="center" key={props.level.id} className="MatrixLevel">
      <div>
        {objectivesNode}
      </div>
      {props.editing ? (
        <CreateObjectiveForm
          levelId={props.level.id}
          category={props.category}
          courseId={props.courseId}
          newOrder={newOrder}
        />
      ) : (
        null
      )}
    </Table.Cell>
  )
}

MatrixLevel.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  level: PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  courseId: PropTypes.number,
  editing: PropTypes.bool.isRequired,
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  activeTaskId: PropTypes.number,
  showDetails: PropTypes.bool
}

MatrixLevel.defaultProps = {
  courseId: null,
  activeTaskId: null,
  showDetails: false
}

export default MatrixLevel
