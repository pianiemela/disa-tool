import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Tasklist from './components/tasks/Tasklist'
import Matrix from '../EditMatrix/components/matrix/Matrix'

class EditTasksPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTask: null
    }
  }

  changeActive = (id) => {
    if (id === this.state.activeTask) {
      this.setState({
        activeTask: null
      })
    } else {
      this.setState({
        activeTask: id
      })
    }
  }

  render() {
    return (
      <div className="EditTasksPage">
        <Matrix editing={false} />
        <Tasklist
          courseId={this.props.courseId}
          editing
          activeTask={this.state.activeTask}
          changeActive={this.changeActive}
        />
      </div>
    )
  }
}

EditTasksPage.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTasksPage
