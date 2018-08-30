import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Label, Popup, Header, Loader, Segment, Grid } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjective } from '../../actions/objectives'
import { addObjectiveToTask, removeObjectiveFromTask } from '../../actions/tasks'
import { taskDetails } from '../../../../api/objectives'

import EditObjectiveForm from './EditObjectiveForm'
import DeleteForm from '../../../../utils/components/DeleteForm'
import MathJaxText from '../../../../utils/components/MathJaxText'

export class MatrixObjective extends Component {
  constructor(props) {
    super(props)
    this.state = {
      triggered: false,
      loading: true,
      cumulative_multiplier: 0,
      tasks: [],
      hasBeenCut: false
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.lastMultiplierUpdate !== this.props.lastMultiplierUpdate) {
      if (this.state.triggered) {
        this.reset()
      }
    }
    if (this.props.isCut && !this.state.hasBeenCut) this.markCut()
  }

  reset() {
    this.setState({
      triggered: false,
      loading: true
    })
  }

  markCut() {
    this.setState({ hasBeenCut: true })
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
    if (this.props.isCut) return <Button icon={{ name: 'paste' }} onClick={() => this.props.cut(null)} />
    return (
      <div className="MatrixObjective flexContainer">
        <div className="objectiveBlock flexContainer">
          {this.props.showDetails ? (
            <Button
              className="objectiveButton"
              toggle
              active={this.props.active}
              compact
              basic
              fluid
              style={{ borderRadius: '0px' }}
              onClick={this.toggleObjective}
            >
              <MathJaxText content={this.props.objective.name} />
            </Button>
          ) : (
            <Segment
              className={`objectiveSegment${this.state.hasBeenCut ? ' appearAnimation' : ''}`}
              style={{ borderRadius: '0px' }}
            >
              <MathJaxText content={this.props.objective.name} />
            </Segment>
          )}
          {this.props.showDetails ? (
            <div>
              <Popup
                trigger={<Label
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
            <Button
              style={{ margin: '5px auto 5px auto' }}
              type="button"
              icon={{ name: 'cut' }}
              size="mini"
              onClick={() => this.props.cut(this.props.objective.id)}
            />
            <EditObjectiveForm style={{ margin: '5px auto 5px auto' }} objectiveId={this.props.objective.id} />
          </div>
        ) : (
          null
        )}
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
  isCut: PropTypes.bool.isRequired,
  cut: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

MatrixObjective.defaultProps = {
  activeTaskId: null,
  showDetails: false,
  lastMultiplierUpdate: null
}

const mapStateToProps = (state, ownProps) => ({
  lastMultiplierUpdate: state.task.lastMultiplierUpdate,
  isCut: state.objective.cut === ownProps.objective.id
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeObjective: asyncAction(removeObjective, dispatch),
  toggleObjective: ownProps.active ? (
    asyncAction(removeObjectiveFromTask, dispatch)
  ) : (
    asyncAction(addObjectiveToTask, dispatch)
  ),
  taskDetails,
  cut: id => dispatch({ type: 'OBJECTIVE_CUT', cut: id })
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(MatrixObjective))
