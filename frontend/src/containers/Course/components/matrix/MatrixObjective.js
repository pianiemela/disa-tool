import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Label, Popup, Header, Loader, Segment } from 'semantic-ui-react'
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
      tasks: []
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.lastMultiplierUpdate !== this.props.lastMultiplierUpdate) {
      if (this.state.triggered) {
        this.setState({
          triggered: false,
          loading: true
        })
      }
    }
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
              className="objectiveSegment"
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
                      <p>
                        <span>
                          {'Kerroin yhteensä: '}
                        </span>
                        <strong>
                          {this.state.cumulative_multiplier.toFixed(2)}
                        </strong>
                      </p>
                      <Header>Tehtävät</Header>
                      {this.state.tasks.map(task => (
                        <div key={task.name}>
                          <p>
                            <strong>
                              {task.name}
                            </strong>
                            <span>
                              : {(Number(task.multiplier)).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      ))}
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
              onExecute={() => this.props.removeObjective({ id: this.props.objective.id })}
              prompt={[
                'Poistetaanko oppimistavoite',
                `"${this.props.objective.name}"`
              ]}
              header="Poista oppimistavoite"
            />
            <Button type="button" icon={{ name: 'cut' }} size="mini" onClick={() => this.props.cut(this.props.objective.id)} />
            <EditObjectiveForm objectiveId={this.props.objective.id} />
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
  cut: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(MatrixObjective)
