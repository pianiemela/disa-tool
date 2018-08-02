import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, List } from 'semantic-ui-react'

export const CourseInfo = ({ course, toggleActivation, teachers, deleteTeacher }) => {
  const renderTeacherOptions = () => (
    <Grid.Row>
      <Grid.Column width={3}>
        <Button as={Link} to={`/selfAssesment/${course.id}`} color="green" basic>Luo uusi itsearviointi</Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button as={Link} to={`/course/${course.id}`} color="blue" basic>Muokkaa kurssia</Button>
      </Grid.Column>
    </Grid.Row>
  )

  const renderCourseActivation = () => (
    course.active ?
      <Button floated="right" negative onClick={toggleActivation}>Sulje kurssi</Button> :
      <Button floated="right" positive onClick={toggleActivation}>Käynnistä kurssi</Button>
  )

  const renderCourseTeacehrs = () => (
    <Grid.Row>
      <Grid.Column width={6}>
        <Header as="h3">Kurssin opettajat</Header>
        <List>
          {teachers.map(teacher => (
            <List.Item key={teacher.id}>
              {teacher.name}
              {course.courseRole === 'TEACHER' ?
                <Button
                  name="teacherRemoveButton"
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
      {course.courseRole === 'TEACHER' ? renderTeacherOptions() : undefined}
      {teachers ? renderCourseTeacehrs() : undefined}
      <Divider />
    </Grid>
  )
}

export default CourseInfo
