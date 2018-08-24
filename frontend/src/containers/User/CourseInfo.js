import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List } from 'semantic-ui-react'
import LinkExportList from './components/LinkExportList'

export const CourseInfo = (props) => {
  const renderTeacherOptions = () => (
    <Grid.Row>
      <Grid.Column width={3}>
        <Button as={Link} to={`/selfAssesment/${props.course.id}`} color="blue" basic>Muokkaa itsearviointeja</Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button as={Link} to={`/course/${props.course.id}`} color="blue" basic>Muokkaa kurssia</Button>
      </Grid.Column>
      <Grid.Column width={10}>
        <LinkExportList course={props.course} />
      </Grid.Column>
    </Grid.Row>
  )

  const renderCourseActivation = () => (
    props.course.active ?
      <Button floated="right" negative onClick={props.toggleActivation}>Sulje kurssi</Button> :
      <Button floated="right" positive onClick={props.toggleActivation}>Käynnistä kurssi</Button>
  )

  const renderCourseTeachers = () => (
    <Grid.Row>
      <Grid.Column width={6}>
        <Header as="h3">Kurssin opettajat</Header>
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
            <Header.Subheader>Tämä kurssi on </Header.Subheader>
            {props.course.active ? <span><b>käynnissä</b></span> : <span><b>päättynyt</b></span>}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3}>
          <Button as={Link} to={`/courses/matrix/${props.course.id}`} color="blue" basic>Kurssin tavoitematriisi</Button>
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

export default CourseInfo
