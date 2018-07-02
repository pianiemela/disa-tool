import React, { Component } from 'react'
import './tasks.css'

import Task from './Task'

class Tasklist extends Component {
  render() {
    return (
      <div className="taskContainer">
        {this.props.tasks.map(task => <Task task={task} taskSkills={task.skills.map(id => this.props.skills[id])} />)}
      </div>
    )
  }
}

export default Tasklist