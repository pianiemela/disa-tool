import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'
import { arrayOf, shape, func } from 'prop-types'

const renderCourseMenuItem = (course, activeCourse, handleChange) => (
  <Menu.Item
    key={course.id}
    as={Link}
    to={`/user/course/${course.id}`}
    name={course.name}
    color={course.active ? 'blue' : 'black'}
    course={course}
    active={activeCourse.id && activeCourse.id === course.id}
    onClick={handleChange}
  >
    {course.name}
  </Menu.Item>
)

export const CourseSideMenu = ({ courses, activeCourse, handleChange }) => {
  const activeCourses = courses.filter(course => course.active)
  const closedCourses = courses.filter(course => !course.active)
  return (
    <Menu fluid vertical tabular>
      <Menu.Item>
        <Header as="h4">Aktiiviset kurssit</Header>
      </Menu.Item>
      {activeCourses.map(course => renderCourseMenuItem(course, activeCourse, handleChange))}
      <Menu.Item>
        <Header as="h4">Ei-aktiiviset kurssit</Header>
      </Menu.Item>
      {closedCourses.map(course => renderCourseMenuItem(course, activeCourse, handleChange))}
    </Menu>
  )
}

CourseSideMenu.propTypes = {
  courses: arrayOf(shape()).isRequired,
  activeCourse: shape().isRequired,
  handleChange: func.isRequired
}

export default CourseSideMenu
