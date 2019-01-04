import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'

import CreateObjectiveForm from './CreateObjectiveForm'
import MatrixObjective, { dropSpec } from './MatrixObjective'
import dndItem from '../../../../utils/components/DnDItem'
import { editObjective } from '../../actions/objectives'
import asyncAction from '../../../../utils/asyncAction'

const DnDItem = dndItem('objective', {
  source: false,
  dropSpec: {
    drop: (props, monitor) => {
      const { element } = props
      const drag = monitor.getItem()
      if (
        element.category_id === drag.category_id
        &&
        element.skill_level_id === drag.skill_level_id
      ) { return }
      dropSpec.drop(props, monitor)
    }
  }
})

export const MatrixLevel = (props) => {
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
        <DnDItem
          element={{
            order: newOrder,
            category_id: props.category.id,
            skill_level_id: props.level.id
          }}
          mover={props.moveObjective}
        >
          <CreateObjectiveForm
            levelId={props.level.id}
            category={props.category}
            courseId={props.courseId}
            newOrder={newOrder}
          />
        </DnDItem>
      ) : null}
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
  showDetails: PropTypes.bool,
  moveObjective: PropTypes.func.isRequired
}

MatrixLevel.defaultProps = {
  courseId: null,
  activeTaskId: null,
  showDetails: false
}

const mapDispatchToProps = dispatch => ({
  moveObjective: asyncAction(editObjective, dispatch)
})

export default connect(null, mapDispatchToProps)(MatrixLevel)
