import React, { Fragment } from 'react'
import { arrayOf, bool, func, number, shape, string } from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Grid, Header, List, Icon } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import LinkExportList from './components/LinkExportList'
import Conditional from '../../utils/components/Conditional'

export const CourseInfo = (props) => {
  const t = id => props.translate(`UserPage.CourseInfo.${id}`)
  const { course } = props

  return (
    <Fragment>
      <Grid.Row>
        <Grid.Column>
          <Header as="h1">
            {course.name}
            <Conditional visible={props.isTeacher}>{
              <Button floated="right" color={course.active ? 'green' : 'red'} onClick={props.toggleActivation}>{t(course.active ? 'close_course' : 'start_course')}</Button>}
            </Conditional>
            <Header as="h2" color={course.active ? 'green' : 'red'}>
              <Header.Subheader style={{ display: 'inline' }}>{t('this_course_is')}</Header.Subheader>
              {course.active ? <span><b>{t('open')}</b></span> : <span><b>{t('closed')}</b></span>}
            </Header>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Grid.Row>
            <Grid.Column>
              <Button.Group vertical>
                <Button
                  as={Link}
                  to={`/courses/matrix/${course.id}`}
                  basic
                  color="blue"
                  icon
                  labelPosition="right"
                  style={{ marginBottom: '5px' }}
                >
                  {t('course_matrix')}
                  <Icon name="right arrow" />
                </Button>
                <Conditional visible={props.isTeacher}>
                  <Button
                    as={Link}
                    to={`/course/${course.id}`}
                    basic
                    color="blue"
                    icon
                    labelPosition="right"
                    style={{ marginBottom: '5px' }}
                  >
                    {t('edit_course')}
                    <Icon name="right arrow" />
                  </Button>
                  <Button
                    as={Link}
                    to={{ pathname: `${course.id}/tasksAndPeople`, state: { courseId: course.id } }}
                    basic
                    color="blue"
                    icon
                    labelPosition="right"
                    style={{ marginBottom: '5px' }}
                  >
                    Manage course people and tasks
                    <Icon name="right arrow" />
                  </Button>
                </Conditional>
              </Button.Group>
              <Conditional visible={props.isTeacher}>
                <LinkExportList course={course} />
              </Conditional>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
        <Conditional visible={!!props.teachers}>
          <Grid.Column>
            <Header as="h3">{t('course_teachers')}</Header>
            <List>
              {props.teachers.map(teacher => (
                <List.Item key={teacher.id}>
                  {teacher.name}
                </List.Item>
              ))}
            </List>
          </Grid.Column>
        </Conditional>
      </Grid.Row>
    </Fragment>
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
