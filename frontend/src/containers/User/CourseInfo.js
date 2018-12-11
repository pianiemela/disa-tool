import React from 'react'
import { arrayOf, bool, func, number, shape, string } from 'prop-types'
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
          to={`/selfAssessment/${props.course.id}`}
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
            <span> {props.isTeacher ? renderCourseActivation() : undefined}</span>
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
      {props.isTeacher ? renderTeacherOptions() : undefined}
      {props.teachers ? renderCourseTeachers() : undefined}
    </Grid>
  )
}

CourseInfo.propTypes = {
  course: shape({
    id: number.isRequired,
    name: string.isRequired,
    active: bool.isRequired,
    courseRole: string.isRequired
  }).isRequired,
  teachers: arrayOf(shape({
    id: number.isRequired,
    name: string.isRequired
  })),
  isTeacher: bool.isRequired,
  toggleActivation: func.isRequired,
  translate: func.isRequired
}

CourseInfo.defaultProps = {
  teachers: []
}

export default withLocalize(CourseInfo)
