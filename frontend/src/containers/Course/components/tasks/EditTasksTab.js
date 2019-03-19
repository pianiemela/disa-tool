import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Container } from 'semantic-ui-react'

import { changeActive } from '../../actions/tasks'

import Task from './Task'
import Matrix from '../matrix/Matrix'
import Headerlist from '../types/Headerlist'
import SelectTaskDropdown from './SelectTaskDropdown'
import SingleAccordion from './SingleAccordion'
import TypesDisplay from './TypesDisplay'
import AddTaskForm from './AddTaskForm'

export class EditTasksTab extends Component {
  componentWillUnmount() {
    this.props.changeActive(null)
  }

  changeActive = (e, { value }) => {
    this.props.changeActive(value)
  }

  translate = id => this.props.translate(`Course.tasks.EditTasksTab.${id}`)

  render() {
    return (
      <div className="EditTasksTab">
        <Container style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1 }}>
            <SelectTaskDropdown
              tasks={this.props.tasks}
              activeTask={this.props.activeTask}
              changeActive={this.changeActive}
            />
          </div>
          <div>
            <AddTaskForm
              courseId={this.props.courseId}
              newOrder={this.props.tasks.reduce(
                (acc, { order }) => Math.max(acc, order),
                0
              ) + 1}
            />
          </div>
        </Container>
        {this.props.activeTask ? (
          <Container>
            <Task task={this.props.activeTask} />
          </Container>
        ) : null}
        <Container>
          <SingleAccordion
            title={(
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: '20px' }}>Types</span>
                {this.props.activeTask ? (
                  <TypesDisplay
                    defaultText={this.translate('default')}
                    defaultMultiplier={this.props.activeTask.defaultMultiplier}
                    types={this.props.activeTask.types}
                  />
                ) : null}
              </div>
            )}
          >
            <Headerlist
              courseId={this.props.courseId}
              editing={false}
            />
          </SingleAccordion>
        </Container>
        <Container>
          <SingleAccordion title={this.translate('matrix')}>
            <Matrix editing={false} showDetails />
          </SingleAccordion>
        </Container>
      </div>
    )
  }
}

EditTasksTab.propTypes = {
  courseId: PropTypes.number.isRequired,
  changeActive: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeTask: PropTypes.shape({
    id: PropTypes.number.isRequired,
    defaultMultiplier: PropTypes.number,
    types: PropTypes.arrayOf(PropTypes.number).isRequired
  }),
  translate: PropTypes.func.isRequired
}

EditTasksTab.defaultProps = {
  activeTask: null
}

const mapStateToProps = state => ({
  tasks: state.task.tasks,
  activeTask: state.task.active === null ? (
    null
  ) : (
    state.task.tasks.find(task => task.id === state.task.active)
  )
})

export default withLocalize(connect(mapStateToProps, { changeActive })(EditTasksTab))
