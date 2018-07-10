import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'

import AddObjectiveForm from './AddObjectiveForm'
import TaskObjective from './TaskObjective'

const TaskObjectivelist = props => (
  <div className="TaskObjectivelist">
    {props.task.objectives.map(objective => (
      <Grid.Row key={objective.id}>
        <Grid.Column textAlign="right">
          <TaskObjective task={props.task} objective={objective} editing={props.editing} />
        </Grid.Column>
      </Grid.Row>
    ))}
    {props.editing ? (
      <AddObjectiveForm
        objectiveIds={props.task.objectives.map(objective => objective.id)}
        task={props.task}
      />
    ) : (
      <div />
    )}
  </div>
)

TaskObjectivelist.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    })).isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired
}

export default TaskObjectivelist
