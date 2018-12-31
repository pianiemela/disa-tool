import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Grid, Segment, Header } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeTask, changeActive, moveTask } from '../../actions/tasks'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditTaskForm from './EditTaskForm'
import MathJaxText from '../../../../utils/components/MathJaxText'
import dndItem from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('task')

export class Task extends Component {
  translate = id => this.props.translate(`Course.tasks.Task.${id}`)

  renderExpanded() {
    if (!this.props.active) {
      return null
    }
    return (
      <Grid.Row>
        <Grid stretched>
          <Grid.Row>
            <Grid.Column width={13}>
              <MathJaxText content={this.props.task.description} />
              <p><b>{this.translate('info')}: </b>{this.props.task.info}</p>
              <p><b>{this.translate('max_points')}: </b>{this.props.task.max_points}</p>
            </Grid.Column>
            <Grid.Column stretched width={3} textAlign="center" verticalAlign="middle">
              {this.props.editing ? (
                <div>
                  <div className="taskControlButton">
                    <EditTaskForm taskId={this.props.task.id} />
                  </div>
                  <div className="taskControlButton">
                    <Button basic onClick={this.props.openModal}>{this.translate('edit_multipliers_button')}</Button>
                  </div>
                </div>
              ) : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Row>
    )
  }

  render() {
    return (
      <DnDItem element={this.props.task} mover={this.props.moveTask}>
        <div className="Task">
          <Segment
            textAlign="center"
            style={{ padding: '2px' }}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width={14}>
                  <Header style={{ marginTop: '5px' }}>{this.props.task.name}</Header>
                </Grid.Column>
                <Grid.Column width={1}>
                  <Button
                    className="taskButton"
                    icon={this.props.active ? 'caret left' : 'caret down'}
                    onClick={() => this.props.changeActive(this.props.task.id)}
                    basic
                    circular
                    size="small"
                  />
                </Grid.Column>
                <Grid.Column width={1}>
                  {this.props.editing ? (
                    <DeleteForm
                      onExecute={() => this.props.removeTask({ id: this.props.task.id })}
                      prompt={[
                        this.translate('delete_prompt_1'),
                        `"${this.props.task.name}"`
                      ]}
                      header={this.translate('delete_header')}
                    />
                  ) : (
                    null
                  )}
                </Grid.Column>
              </Grid.Row>
              {this.renderExpanded()}
            </Grid>
          </Segment>
        </div>
      </DnDItem>
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
  editing: PropTypes.bool.isRequired,
  removeTask: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  changeActive: PropTypes.func.isRequired,
  openModal: PropTypes.func,
  translate: PropTypes.func.isRequired,
  moveTask: PropTypes.func.isRequired
}

Task.defaultProps = {
  openModal: () => {}
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  active: state.task.active === ownProps.task.id
})

// TODO: CHANGE ALL DISPATCHES TO USE SAME FORMAT/TRADITION!!
const mapDispatchToProps = dispatch => ({
  removeTask: asyncAction(removeTask, dispatch),
  changeActive: id => dispatch(changeActive(id)),
  moveTask: moveTask(dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Task))
