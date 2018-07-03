import React, { Component } from 'react'
import { connect } from 'react-redux'
import './tasks.css'

import Task from './Task'

class Tasklist extends Component {
  render() {
    return (
      <div className="taskContainer">
        {this.props.tasks.map(task => <Task key={task.name} task={task} skills={this.props.skills} editing={this.props.editing} />)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    tasks: state.task.tasks,
    skills: state.skill.skills
  }
}

export default connect(mapStateToProps, null)(Tasklist)