import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Icon } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { details } from '../../../api/courses'
import { editCourse } from '../actions/courses'

import ModalForm, { saveActions } from '../../../utils/components/ModalForm'
import MultilingualField from '../../../utils/components/MultilingualField'

export class EditCourseForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        name: {
          eng: '',
          fin: '',
          swe: ''
        }
      },
      loading: true,
      triggered: false
    }
  }

  editCourseSubmit = (e) => {
    this.props.editCourse({
      id: this.props.course_id,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
    this.setState({
      triggered: false,
      loading: true
    })
  }

  loadDetails = async () => {
    if (this.state.triggered) return
    this.setState({ triggered: true })
    const courseDetails = (await details({
      id: this.props.course_id
    })).data.data
    this.setState({
      values: {
        name: {
          eng: courseDetails.eng_name,
          fin: courseDetails.fin_name,
          swe: courseDetails.swe_name
        }
      },
      loading: false
    })
  }

  translate = id => this.props.translate(`CourseList.EditCourseForm.${id}`)

  render() {
    const contentPrompt = this.translate('renameCourse')
    return (
      <div className="EditCourseForm">
        <ModalForm
          header={this.translate('rename')}
          trigger={<Button
            type="button"
            labelPosition="left"
            color="teal"
            fluid
            icon
            basic
          >
            {this.translate('rename_trigger')}
            <Icon name="tag" color="teal" />
          </Button>}
          onSubmit={this.editCourseSubmit}
          actions={saveActions(this.translate)}
          loading={this.state.loading}
          onOpen={this.loadDetails}
        >
          <p>{contentPrompt}.</p>
          <MultilingualField field="name" fieldDisplay={this.translate('name')} values={this.state.values.name} />
        </ModalForm>
      </div>
    )
  }
}

EditCourseForm.propTypes = {
  course_id: PropTypes.number.isRequired,
  editInstance: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editInstance: asyncAction(editCourse, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(EditCourseForm))
