import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { changeActive } from '../../actions/tasks'

import Tasklist from './Tasklist'
import Matrix from '../matrix/Matrix'
import Headerlist from '../types/Headerlist'
import SelectTaskDropdown from './SelectTaskDropdown'
import EditTaskObjectivesForm from './EditTaskObjectivesForm';

export class EditTasksTab extends PureComponent {
  componentWillUnmount() {
    this.props.changeActive(null)
  }

  changeActive = (e, { value }) => {
    this.props.changeActive(value)
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
          <EditTaskObjectivesForm taskId={this.props.activeTask.id} />
        ) : null}
        <Matrix editing={false} showDetails />
        <Headerlist
          courseId={this.props.courseId}
          editing={false}
        />
        <Tasklist
          courseId={this.props.courseId}
          editing
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
