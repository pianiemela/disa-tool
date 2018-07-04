import React, { Component } from 'react'
import { connect } from 'react-redux'
import './tasks.css'
import asyncAction from '../../../../utils/asyncAction'

import { getTasksForCourse } from '../../services/tasks'
import { getSkillsForCourse } from '../../services/skills'

import Task from './Task'

class Tasklist extends Component {
  componentWillMount() {
    this.props.getTasksForCourse({
      courseId: 1
    })
    this.props.getSkillsForCourse({
      courseId: 1
    })
  }

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

const mapDispatchToProps = dispatch => {
  return {
    getTasksForCourse: asyncAction(getTasksForCourse, dispatch),
    getSkillsForCourse: asyncAction(getSkillsForCourse, dispatch)
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Tasklist)