import React, { Component } from 'react'
import './tasks.css'

import Task from './Task'

class Tasklist extends Component {
  render() {
    return (
      <div className="taskContainer">
        {this.props.tasks.map(task => <Task key={task.name} task={task} skills={this.props.skills} />)}
      </div>
    )
  }
}

export default Tasklist