import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List } from 'semantic-ui-react'
import LinkExportList from './components/LinkExportList'

export const CourseInfo = ({ course, toggleActivation, teachers, deleteTeacher }) => {
  const renderTeacherOptions = () => (
    <Grid.Row>
      <Grid.Column width={3}>
        <Button as={Link} to={`/selfAssesment/${course.id}`} color="blue" basic>Muokkaa itsearviointeja</Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button as={Link} to={`/course/${course.id}`} color="blue" basic>Muokkaa kurssia</Button>
      </Grid.Column>
      <Grid.Column width={10}>
        <LinkExportList course={course} />
      </Grid.Column>
    </Grid.Row>
  )

  const renderCourseActivation = () => (
    course.active ?
      <Button floated="right" negative onClick={toggleActivation}>Sulje kurssi</Button> :
      <Button floated="right" positive onClick={toggleActivation}>Käynnistä kurssi</Button>
  )

  const renderCourseTeachers = () => (
    <Grid.Row>
      <Grid.Column width={6}>
        <Header as="h3">Kurssin opettajat</Header>
        <List>
          {teachers.map(teacher => (
            <List.Item key={teacher.id}>
              {teacher.name}
              {course.courseRole === 'TEACHER' ?
                <Button
                  floated="right"
                  basic
                  circular
                  color="red"
                  size="mini"
                  icon="delete"
                  value={teacher.id}
                  onClick={deleteTeacher}
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
            {course.name}
            <span> {course.courseRole === 'TEACHER' ? renderCourseActivation() : undefined}</span>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" color={course.active ? 'green' : 'red'}>
            <Header.Subheader>Tämä kurssi on </Header.Subheader>
            {course.active ? <span><b>käynnissä</b></span> : <span><b>päättynyt</b></span>}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3}>
          <Button as={Link} to={`/course/matrix/${course.id}`} color="blue" basic>Kurssin tavoitematriisi</Button>
        </Grid.Column>
      </Grid.Row>
      <Divider />
      {course.courseRole === 'TEACHER' ? renderTeacherOptions() : undefined}
      {teachers ? renderCourseTeachers() : undefined}
    </Grid>
  )
}

export default CourseInfo
