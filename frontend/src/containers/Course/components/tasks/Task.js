import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Grid, Segment, Header } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeTask } from '../../actions/tasks'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditTaskForm from './EditTaskForm'
import MathJaxText from '../../../../utils/components/MathJaxText'
import EditTaskObjectivesForm from './EditTaskObjectivesForm'
import { getCourseInstanceDataAction } from '../../../../actions/actions'

export class Task extends Component {
  translate = id => this.props.translate(`Course.tasks.Task.${id}`)

  render() {
    return (
      <Segment
        className="Task"
        textAlign="center"
        style={{ padding: '2px' }}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={14}>
              <Header style={{ marginTop: '5px' }}>{this.props.task.name}</Header>
            </Grid.Column>
            <Grid.Column width={1}>
              <DeleteForm
                onExecute={() => {
                  this.props.removeTask({ id: this.props.task.id })
                    .then(() => { this.props.updateCourseInfo(this.props.courseId) })
                }}
                prompt={[
                  this.translate('delete_prompt_1'),
                  `"${this.props.task.name}"`
                ]}
                header={this.translate('delete_header')}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={13}>
              <MathJaxText content={this.props.task.description} />
              <p><b>{this.translate('info')}: </b>{this.props.task.info}</p>
              <p><b>{this.translate('max_points')}: </b>{this.props.task.max_points}</p>
            </Grid.Column>
            <Grid.Column stretched width={3} verticalAlign="middle">
              <div className="taskControlButton">
                <EditTaskForm taskId={this.props.task.id} />
              </div>
              <div className="taskControlButton">
                <EditTaskObjectivesForm
                  taskId={this.props.task.id}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    max_points: PropTypes.number.isRequired
  }).isRequired,
  removeTask: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired,
  updateCourseInfo: PropTypes.func.isRequired
}

// TODO: CHANGE ALL DISPATCHES TO USE SAME FORMAT/TRADITION!!
const mapDispatchToProps = dispatch => ({
  removeTask: asyncAction(removeTask, dispatch),
  updateCourseInfo: courseId => dispatch(getCourseInstanceDataAction(courseId))
})

export default withLocalize(connect(null, mapDispatchToProps)(Task))
