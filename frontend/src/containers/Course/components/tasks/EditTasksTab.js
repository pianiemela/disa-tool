import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Container } from 'semantic-ui-react'

import { changeActive } from '../../actions/tasks'

import Tasklist from './Tasklist'
import Matrix from '../matrix/Matrix'
import Headerlist from '../types/Headerlist'
import SelectTaskDropdown from './SelectTaskDropdown'
import EditTaskObjectivesForm from './EditTaskObjectivesForm'

export class EditTasksTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editTaskObjectivesFormExpanded: false
    }
    this.closeEditTaskObjectivesForm = this.closeEditTaskObjectivesForm.bind(this)
    this.openEditTaskObjectivesForm = this.openEditTaskObjectivesForm.bind(this)
  }

  componentWillUnmount() {
    this.props.changeActive(null)
  }

  changeActive = (e, { value }) => {
    this.props.changeActive(value)
  }

  openEditTaskObjectivesForm() {
    this.setState({
      editTaskObjectivesFormExpanded: true
    })
  }

  closeEditTaskObjectivesForm() {
    this.setState({
      editTaskObjectivesFormExpanded: false
    })
  }

  render() {
    return (
      <div className="EditTasksTab">
        <SelectTaskDropdown
          tasks={this.props.tasks}
          activeTask={this.props.activeTask}
          changeActive={this.changeActive}
        />
        {this.props.activeTask ? (
          <Container>
            <Button onClick={this.openEditTaskObjectivesForm}>Muokkaa kertoimia</Button>
            <EditTaskObjectivesForm
              taskId={this.props.activeTask.id}
              expanded={this.state.editTaskObjectivesFormExpanded}
              onClose={this.closeEditTaskObjectivesForm}
            />
          </Container>
        ) : null}
        <Matrix editing={false} showDetails />
        <Headerlist
          courseId={this.props.courseId}
          editing={false}
        />
        <Tasklist
          courseId={this.props.courseId}
          editing
          openModal={this.openEditTaskObjectivesForm}
        />
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
    defaultMultiplier: PropTypes.number
  })
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

const mapDispatchToProps = dispatch => ({
  changeActive: changeActive(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTasksTab)
