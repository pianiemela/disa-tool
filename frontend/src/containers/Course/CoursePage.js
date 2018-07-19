import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

export const CoursePage = props => (
  <div className="CoursePage">
    <Link to={`/course/${props.courseId}/matrix`}>Matrix</Link>
    <br />
    <Link to={`/course/${props.courseId}/types`}>Types</Link>
    <br />
    <Link to={`/course/${props.courseId}/tasks`}>Tasks</Link>
  </div>
)

export default withRouter(CoursePage)
