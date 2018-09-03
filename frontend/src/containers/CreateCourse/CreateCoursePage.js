import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Redirect } from 'react-router-dom'
import { Form, Button, Segment, Header } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'
import './createCourse.css'

import { createCourse } from './services/createCourse'

import MultilingualField from '../../utils/components/MultilingualField'

export class CreateCoursePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  createCourseSubmit = (e) => {
    e.preventDefault()
    this.props.createCourse({
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    }).then(() => this.setState({ redirect: true }))
  }

  translate = id => this.props.translate(`CreateCourse.CreateCoursePage.${id}`)

  render() {
    if (this.state.redirect) {
      return <Redirect to="/courses" />
    }
    const label = {
      name: this.translate('name')
    }
    return (
      <div className="CreateCoursePage">
        <Segment className="formContainer" basic padded>
          <Header>{this.translate('header')}</Header>
          <Form onSubmit={this.createCourseSubmit}>
            <MultilingualField field="name" fieldDisplay={label.name} />
            <Button type="submit" color="green">{this.translate('create')}</Button>
          </Form>
        </Segment>
      </div>
    )
  }
}

CreateCoursePage.propTypes = {
  createCourse: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  createCourse: asyncAction(createCourse, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(CreateCoursePage))
