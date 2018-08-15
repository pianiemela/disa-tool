import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Form } from 'semantic-ui-react'

import AssessmentButtons from './AssessmentButtons'
import SelfAssesmentList from './SelfAssesmentList'

export class EditOrNewForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: [],
      selectedView: '',
      dropDownValue: '',
      selectedSelfAssesments: []
    }
  }

  componentDidMount() {
    this.setState({ dropDownValue: parseInt(this.props.selectedCourse) })
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    let { active } = this.state
    const opened = active.includes(index)
      ? (active = active.filter(i => i !== index))
      : active.concat(index)
    this.setState({ active: opened })
  }

  handleDropdownChange = (e, { value }) => {
    const selectedSelfAssesments = this.props.selfAssesments.filter(sa =>
      sa.course_instance_id === value)
    this.setState({ selectedSelfAssesments })
    this.setState({ dropDownValue: value })
  }

  sendFormId = (editOrCreate, type, id) => {
    if (editOrCreate === 'create') {
      this.props.createForm(this.state.dropDownValue, type)
    } else {
      this.props.editForm(id)
    }
  }

  toggleButton = (e) => {
    const { value } = e.target
    this.setState({ selectedView: value })
  }

  render() {
    const { selectedView } = this.state
    const { dropDownCourse, selectedCourse } = this.props
    let selfAssesments = this.state.selectedSelfAssesments
    if (this.props.selectedCourse && selfAssesments.length === 0) {
      selfAssesments = this.props.selfAssesments.filter(s => s.course_instance_id === parseInt(selectedCourse, 10))
    }

    return (
      <Form>
        <Form.Field style={{ marginTop: '20px' }}>
          <Dropdown
            selection
            placeholder={"Valitse kurssi"}
            onChange={this.handleDropdownChange}
            options={dropDownCourse}
            defaultValue={parseInt(selectedCourse, 10)}
          />
        </Form.Field>
        <Form.Field>
          <SelfAssesmentList
            onClick={this.sendFormId}
            selfAssesments={selfAssesments}
          />
        </Form.Field>
        <Form.Field>
          <AssessmentButtons
            selectedView={selectedView}
            category="category"
            objectives="objectives"
            toggleButton={this.toggleButton}
            sendFormId={this.sendFormId}
          />
        </Form.Field>
      </Form>
    )
  }
}

EditOrNewForm.propTypes = {
  dropDownCourse: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  createForm: PropTypes.func.isRequired
}

EditOrNewForm.defaultProps = {
  dropdownAssesments: []
}
export default EditOrNewForm
