import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func, shape } from 'prop-types'
import { Accordion, Button, Dropdown, Icon, List } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

import { findPeople } from '../../api/persons'
import { updateCoursePersonsAction, deleteCoursePersonAction } from '../../actions/actions'

class ManageCoursePeople extends Component {
  state = {
    activeIndex: -1,
    searchPeople: [],
    newStudent: {}
  }

  t = id => this.props.translate(`UserPage.ManageCoursePeople.${id}`)

  handleAccordion = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleRoleChange = (e, { person, value }) => {
    const formattedRequest = [{
      person_id: person.id,
      course_instance_id: this.props.activeCourse.id,
      role: value
    }]
    this.props.dispatchCreateOrUpdateCoursePerson(formattedRequest)
  }

  handleSearchChange = (e, { searchQuery }) => {
    if (searchQuery.length > 2) {
      findPeople(searchQuery).then(res => this.setState({
        // filter out people already on course
        searchPeople: res.data.filter(person => !this.props.people.find(p => p.id === person.id))
      }))
    }
  }

  handleAddStudentToCourse = (e, { value }) => {
    if (e.target.name === 'studentAddButton') {
      const formattedRequest = [{
        person_id: this.state.newStudent.id,
        course_instance_id: this.props.activeCourse.id,
        role: 'STUDENT'
      }]
      this.props.dispatchCreateOrUpdateCoursePerson(formattedRequest)
        .then(() => this.setState({ newStudent: {} }))
    } else {
      this.setState({
        newStudent: this.state.searchPeople.find(person => person.id === value) || {}
      })
    }
  }

  handleRemoveFromCourse = (e, { value }) => {
    const formattedRequest = {
      id: value,
      course_instance_id: this.props.activeCourse.id
    }
    this.props.dispatchDeleteCoursePerson(formattedRequest)
  }

  isTeacher = person => (
    person.course_instances[0].course_person.role === 'TEACHER'
  )

  render() {
    const { activeIndex } = this.state
    const { people } = this.props
    return (
      <Accordion styled>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordion}>
          <Icon name="dropdown" />
          {this.t('manage_course_people')}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <h5>{this.t('add_a_user')}</h5>
          <Dropdown
            name="studentSelector"
            closeOnChange
            closeOnBlur
            selection
            search
            placeholder={this.t('search_student')}
            value={this.state.newStudent.id}
            options={this.state.searchPeople.map(person => (
            { key: person.id, text: person.name, value: person.id }
          ))}
            onChange={this.handleAddStudentToCourse}
            onSearchChange={this.handleSearchChange}
          />
          {this.state.newStudent && this.state.newStudent.id ?
            <div>
              <Button
                name="studentAddButton"
                basic
                color="pink"
                content={this.t('add_student')}
                onClick={this.handleAddStudentToCourse}
              />
              <Button
                basic
                color="red"
                circular
                icon="delete"
                size="tiny"
                value=""
                onClick={this.handleAddStudentToCourse}
              />
            </div> : undefined}
          <List divided siz="tiny" verticalAlign="middle">
            {people.map(person => (
              <List.Item key={person.id}>
                <List.Content floated="right">
                  <Button.Group size="tiny" compact>
                    <Button
                      content={this.t('student')}
                      person={person}
                      positive={!this.isTeacher(person)}
                      value="STUDENT"
                      onClick={this.handleRoleChange}
                    />
                    <Button.Or />
                    <Button
                      content={this.t('teacher')}
                      person={person}
                      positive={this.isTeacher(person)}
                      value="TEACHER"
                      onClick={this.handleRoleChange}
                    />
                  </Button.Group>
                  &nbsp;
                  <Button
                    basic
                    color="red"
                    compact
                    content={this.t('remove_from_course')}
                    size="tiny"
                    value={person.id}
                    onClick={this.handleRemoveFromCourse}
                  />
                </List.Content>
                <List.Content>
                  <List.Header>
                    {person.studentnumber} - {person.name}
                  </List.Header>
                </List.Content>
              </List.Item>
          ))}
          </List>
        </Accordion.Content>
      </Accordion>

    )
  }
}

ManageCoursePeople.propTypes = {
  activeCourse: shape().isRequired,
  people: arrayOf(shape()).isRequired,
  dispatchDeleteCoursePerson: func.isRequired,
  dispatchCreateOrUpdateCoursePerson: func.isRequired,
  translate: func.isRequired
}

export default connect(null, {
  dispatchCreateOrUpdateCoursePerson: updateCoursePersonsAction,
  dispatchDeleteCoursePerson: deleteCoursePersonAction
})(withLocalize(ManageCoursePeople))
