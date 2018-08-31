import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import LinkExportList from './components/LinkExportList'

export const CourseInfo = (props) => {
  const t = id => props.translate(`UserPage.CourseInfo.${id}`)
  
  const renderTeacherOptions = () => (
    <Grid.Row>
      <Grid.Column width={3}>
        <Button
          as={Link}
          to={`/selfAssesment/${props.course.id}`}
          basic
          color="blue"
          content={t('edit_self_assessments')}
        />
      </Grid.Column>
      <Grid.Column width={3}>
        <Button
          as={Link}
          to={`/course/${props.course.id}`}
          basic
          color="blue"
          content={t('edit_course')}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <LinkExportList course={props.course} />
      </Grid.Column>
    </Grid.Row>
  )

  const renderCourseActivation = () => (
    props.course.active ?
      <Button floated="right" negative onClick={props.toggleActivation}>{t('close_course')}</Button> :
      <Button floated="right" positive onClick={props.toggleActivation}>{t('start_course')}</Button>
  )

  const renderCourseTeachers = () => (
    <Grid.Row>
      <Grid.Column width={6}>
        <Header as="h3">{t('course_teachers')}</Header>
        <List>
          {props.teachers.map(teacher => (
            <List.Item key={teacher.id}>
              {teacher.name}
              {props.course.courseRole === 'TEACHER' ?
                <Button
                  floated="right"
                  basic
                  circular
                  color="red"
                  size="mini"
                  icon="delete"
                  value={teacher.id}
                  onClick={props.deleteTeacher}
                />
                : undefined}
            </List.Item>
          ))}
        </List>
      </Grid.Column>
    </Grid.Row>
  )

  return (
    <Grid padded="horizontally">
      <Grid.Row>
        <Grid.Column>
          <Header as="h1">
            {props.course.name}
            <span> {props.course.courseRole === 'TEACHER' ? renderCourseActivation() : undefined}</span>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" color={props.course.active ? 'green' : 'red'}>
            <Header.Subheader>{t('this_course_is')}</Header.Subheader>
            {props.course.active ? <span><b>{t('open')}</b></span> : <span><b>{t('closed')}</b></span>}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3}>
          <Button as={Link} to={`/courses/matrix/${props.course.id}`} color="blue" basic>{t('course_matrix')}</Button>
        </Grid.Column>
      </Grid.Row>
      <Divider />
      {props.course.courseRole === 'TEACHER' ? renderTeacherOptions() : undefined}
      {props.teachers ? renderCourseTeachers() : undefined}
    </Grid>
  )
}

CourseInfo.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    courseRole: PropTypes.string.isRequired
  }).isRequired,
  toggleActivation: PropTypes.func.isRequired,
  deleteTeacher: PropTypes.func.isRequired,
  teachers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }))
}

CourseInfo.defaultProps = {
  teachers: []
}

export default withLocalize(CourseInfo)
