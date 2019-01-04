import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Label, Popup, Header, Loader, Segment, Grid } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeObjective, editObjective, startDrag, stopDrag } from '../../actions/objectives'
import { addObjectiveToTask, removeObjectiveFromTask } from '../../actions/tasks'
import { taskDetails } from '../../../../api/objectives'
import EditObjectiveForm from './EditObjectiveForm'
import DeleteForm from '../../../../utils/components/DeleteForm'
import MathJaxText from '../../../../utils/components/MathJaxText'
import dndItem, { defaults } from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('objective', {
  dropSpec: {
    ...defaults.dropSpec,
    drop: (props, monitor) => {
      const drag = monitor.getItem()
      const { element, slots } = props
      let slot
      if (
        element.category_id !== drag.category_id
        ||
        element.skill_level_id !== drag.skill_level_id
      ) {
        slot = slots ? slots.previous : element.order
      } else if (drag.order === element.order) {
        slot = drag.order
      } else if (drag.order > element.order) {
        slot = slots.previous
      } else {
        slot = slots.next
      }
      props.mover({
        id: drag.id,
        order: slot,
        category_id: element.category_id,
        skill_level_id: element.skill_level_id
      })
    }
  },
  dragSpec: {
    ...defaults.dragSpec,
    beginDrag: (props) => {
      props.startDrag()
      return {
        id: props.element.id,
        order: props.element.order,
        category_id: props.element.category_id,
        skill_level_id: props.element.skill_level_id
      }
    },
    endDrag: (props) => {
      props.stopDrag()
    }
  }
})

export class MatrixObjective extends Component {
  constructor(props) {
    super(props)
    this.state = {
      triggered: false,
      loading: true,
      cumulative_multiplier: 0,
      tasks: []
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.lastMultiplierUpdate !== this.props.lastMultiplierUpdate) {
      if (this.state.triggered) {
        this.reset()
      }
    }
  }

  reset() {
    this.setState({
      triggered: false,
      loading: true
    })
  }

  toggleObjective = () => {
    if (this.props.activeTaskId !== null) {
      this.props.toggleObjective({
        objective_id: this.props.objective.id,
        task_id: this.props.activeTaskId
      })
    }
  }

  loadDetails = async () => {
    if (this.state.triggered) {
      return
    }
    this.setState({
      triggered: true
    })
    const objectiveDetails = (
      await this.props.taskDetails({ id: this.props.objective.id })
    ).data.data
    let cumMultiplier = 0
    objectiveDetails.tasks.forEach((task) => {
      cumMultiplier += task.multiplier
    })
    this.setState({
      cumulative_multiplier: cumMultiplier,
      tasks: objectiveDetails.tasks,
      loading: false
    })
  }

  translate = id => this.props.translate(`Course.matrix.MatrixObjective.${id}`)

  render() {
    return (
      <div className="MatrixObjective">
        <DnDItem
          element={{
            ...this.props.objective,
            category_id: this.props.categoryId,
            skill_level_id: this.props.skillLevelId
          }}
          mover={this.props.moveObjective}
          startDrag={this.props.startDrag}
          stopDrag={this.props.stopDrag}
          slots={this.props.slots}
        >
          <div className="flexContainer">
            <div className="objectiveBlock flexContainer">
              {this.props.showDetails ? (
                <Button
                  className="objectiveButton"
                  toggle
                  active={this.props.active}
                  compact
                  basic
                  fluid
                  style={{ borderRadius: '0px', cursor: this.props.activeTaskId ? undefined : 'default' }}
                  onClick={this.toggleObjective}
                >
                  <MathJaxText content={this.props.objective.name} />
                </Button>
              ) : (
                <Segment
                  className={`objectiveSegment${this.props.dragging ? ' appearAnimation' : ''}`}
                  style={{ borderRadius: '0px' }}
                >
                  <MathJaxText content={this.props.objective.name} />
                </Segment>
              )}
              {this.props.showDetails ? (
                <div>
                  <Popup
                    trigger={<Label
                      size="large"
                      circular
                      content={this.props.objective.task_count}
                      onMouseOver={this.loadDetails}
                      onFocus={this.loadDetails}
                      style={{
                        color: this.props.objective.task_count === 0 ? 'red' : undefined
                      }}
                    />}
                    content={
                      this.state.loading ? (
                        <Loader active inline />
                      ) : (
                        <div>
                          <div>
                            <span>{this.translate('cumulative')}</span>
                            <Label>
                              <strong>{this.state.cumulative_multiplier.toFixed(2)}</strong>
                            </Label>
                          </div>
                          <Header>
                            <span className="capitalize">{this.translate('tasks')}</span>
                          </Header>
                          <Grid>
                            {this.state.tasks.map(task => (
                              <Grid.Row key={task.name}>
                                <Grid.Column width={12}>
                                  <span>{task.name}</span>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign="left">
                                  <Label>
                                    {(Number(task.multiplier)).toFixed(2)}
                                  </Label>
                                </Grid.Column>
                              </Grid.Row>
                            ))}
                          </Grid>
                        </div>
                      )}
                  />
                </div>
              ) : (
                null
              )}
            </div>
            {this.props.editing ? (
              <div className="removeBlock">
                <DeleteForm
                  style={{ margin: '5px auto 5px auto' }}
                  onExecute={() => this.props.removeObjective({ id: this.props.objective.id })}
                  prompt={[
                    this.translate('delete_prompt_1'),
                    `"${this.props.objective.name}"`
                  ]}
                  header={this.translate('delete_header')}
                />
                <EditObjectiveForm style={{ margin: '5px auto 5px auto' }} objectiveId={this.props.objective.id} />
              </div>
            ) : (
              null
            )}
          </div>
        </DnDItem>
      </div>
    )
  }
}

MatrixObjective.propTypes = {
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    task_count: PropTypes.number
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeObjective: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  toggleObjective: PropTypes.func.isRequired,
  activeTaskId: PropTypes.number,
  taskDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.bool,
  lastMultiplierUpdate: PropTypes.instanceOf(Date),
  translate: PropTypes.func.isRequired,
  dragging: PropTypes.shape({
    category_id: PropTypes.number.isRequired,
    skill_level_id: PropTypes.number.isRequired
  }),
  moveObjective: PropTypes.func.isRequired,
  startDrag: PropTypes.func.isRequired,
  stopDrag: PropTypes.func.isRequired,
  categoryId: PropTypes.number.isRequired,
  skillLevelId: PropTypes.number.isRequired,
  slots: PropTypes.shape({
    previous: PropTypes.number.isRequired,
    next: PropTypes.number.isRequired
  }).isRequired
}

MatrixObjective.defaultProps = {
  activeTaskId: null,
  showDetails: false,
  lastMultiplierUpdate: null,
  dragging: null
}

const mapStateToProps = state => ({
  lastMultiplierUpdate: state.task.lastMultiplierUpdate,
  dragging: state.objective.dragging
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeObjective: asyncAction(removeObjective, dispatch),
  toggleObjective: ownProps.active ? (
    asyncAction(removeObjectiveFromTask, dispatch)
  ) : (
    asyncAction(addObjectiveToTask, dispatch)
  ),
  taskDetails,
  moveObjective: asyncAction(editObjective, dispatch),
  startDrag: startDrag({
    category_id: ownProps.categoryId,
    skill_level_id: ownProps.skillLevelId
  })(dispatch),
  stopDrag: stopDrag(dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(MatrixObjective))
