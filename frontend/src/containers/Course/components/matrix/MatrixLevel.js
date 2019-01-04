import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'

import { startDrag, changeCell } from '../../actions/objectives'
import CreateObjectiveForm from './CreateObjectiveForm'
import MatrixObjective from './MatrixObjective'
import dndItem, { defaults } from '../../../../utils/components/DnDItem'
import asyncAction from '../../../../utils/asyncAction'

const DnDItem = dndItem('objective', {
  source: false,
  dropSpec: {
    ...defaults.dropSpec,
    hover: (props, monitor) => {
      const hover = props.element
      const drag = monitor.getItem()
      if (hover.category_id === drag.category_id && hover.skill_level_id === drag.skill_level_id) {
        return
      }
      props.startDrag()
      props.changeCell({
        call: {
          id: drag.id,
          order: hover.newOrder,
          category_id: hover.category_id,
          skill_level_id: hover.skill_level_id
        },
        local: {
          name: drag.name,
          task_count: drag.task_count
        }
      })
      drag.order = hover.newOrder
      drag.category_id = hover.category_id
      drag.skill_level_id = hover.skill_level_id
    }
  }
})

const MatrixLevel = (props) => {
  const objectives = props.level.objectives.sort((a, b) => a.order - b.order)
  let newOrder = 1
  if (objectives.length > 0) {
    newOrder = objectives[objectives.length - 1].order + 1
  }
  return (
    <Table.Cell textAlign="center" key={props.level.id} className="MatrixLevel">
      <DnDItem
        element={{
          category_id: props.category.id,
          skill_level_id: props.level.id,
          newOrder
        }}
        startDrag={props.startDrag}
        changeCell={props.changeCell}
      >
        <div>
          {objectives.map(objective => (
            <MatrixObjective
              key={objective.id}
              objective={objective}
              editing={props.editing}
              active={Boolean(props.activeMap[objective.id])}
              activeTaskId={props.activeTaskId}
              showDetails={props.showDetails}
              categoryId={props.category.id}
              skillLevelId={props.level.id}
            />
          ))}
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
      </DnDItem>
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
  startDrag: PropTypes.func.isRequired,
  changeCell: PropTypes.func.isRequired
}

MatrixLevel.defaultProps = {
  courseId: null,
  activeTaskId: null,
  showDetails: false
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  startDrag: startDrag({
    category_id: ownProps.category.id,
    skill_level_id: ownProps.level.id
  })(dispatch),
  changeCell: asyncAction(changeCell, dispatch)
})

export default connect(null, mapDispatchToProps)(MatrixLevel)
