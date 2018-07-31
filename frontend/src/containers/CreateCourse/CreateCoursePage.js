import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { createCourse } from './services/createCourse'

import MultilingualField from '../../utils/components/MultilingualField'

class CreateCoursePage extends Component {
  createCourseSubmit = (e) => {
    e.preventDefault()
    this.props.createCourse({
      eng_name: e.target.eng_name,
      fin_name: e.target.fin_name,
      swe_name: e.target.swe_name
    })
  }

  render() {
    const label = {
      name: 'nimi'
    }
    return (
      <div className="CreateCoursePage">
        <Form onSubmit={this.createCourseSubmit}>
          <MultilingualField field="name" fieldDisplay={label.name} />
          <Button type="submit" color="green">Luo</Button>
        </Form>
      </div>
    )
  }
}

CreateCoursePage.propTypes = {
  createCourse: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  createCourse: asyncAction(createCourse, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateCoursePage)
