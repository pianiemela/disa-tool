import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Label, Popup, Header, Loader } from 'semantic-ui-react'
import MathJax from 'react-mathjax-preview'
import asyncAction from '../../../../utils/asyncAction'

import { removeObjective } from '../../actions/objectives'
import { addObjectiveToTask, removeObjectiveFromTask } from '../../actions/tasks'
import { details } from '../../../../api/objectives'

import DeleteForm from '../../../../utils/components/DeleteForm'

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
    const objectiveDetails = (await this.props.details({ id: this.props.objective.id })).data.data
    let cumMultiplier = 0
    objectiveDetails.tasks.forEach((task) => {
      cumMultiplier += task.type_multiplier * task.task_multiplier
    })
    this.setState({
      cumulative_multiplier: cumMultiplier,
      tasks: objectiveDetails.tasks,
      loading: false
    })
  }

  render() {
    return (
      <div className="MatrixObjective">
        <div className="objectiveBlock flexContainer">
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
            <MathJax math={this.props.objective.name} />
          </Button>
          {this.props.showDetails ? (
            <div>
              <Popup
                trigger={<Label
                  content={this.props.objective.task_count}
                  onMouseOver={this.loadDetails}
                  onFocus={this.loadDetails}
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
                              : {(task.type_multiplier * task.task_multiplier).toFixed(2)}
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
        <div className="removeBlock">
          {this.props.editing ? (
            <DeleteForm
              onExecute={() => this.props.removeObjective({ id: this.props.objective.id })}
              prompt={[
                'Poistetaanko oppimistavoite',
                `"${this.props.objective.name}"`
              ]}
              header="Poista oppimistavoite"
            />
          ) : (
            null
          )}
        </div>
      </div>
    )
  }
}

MatrixObjective.propTypes = {
  objective: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    task_count: PropTypes.number.isRequired
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  removeObjective: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  toggleObjective: PropTypes.func.isRequired,
  activeTaskId: PropTypes.number,
  details: PropTypes.func.isRequired,
  showDetails: PropTypes.bool
}

MatrixObjective.defaultProps = {
  activeTaskId: null,
  showDetails: false
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeObjective: asyncAction(removeObjective, dispatch),
  toggleObjective: ownProps.active ? (
    asyncAction(removeObjectiveFromTask, dispatch)
  ) : (
    asyncAction(addObjectiveToTask, dispatch)
  ),
  details
})

export default connect(null, mapDispatchToProps)(MatrixObjective)
