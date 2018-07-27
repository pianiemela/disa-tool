import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, List, Dropdown, Form } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import CategorySelection from './CategorySelection'
import DropDownSelection from './DropDownSelection'
import SelfAssesmentList from './SelfAssesmentList'

class SelfAssesmentCreateForm extends React.Component {
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

  sendFormId = (editOrCreate, id) => {
    if (editOrCreate === 'create') {
      this.props.createForm(this.state.dropDownValue, this.state.selectedView)
    } else {
      this.props.editForm(id)
    }
  }

  toggleButton = (e) => {
    const { value } = e.target
    this.setState({ selectedView: value })
  }

  // renderCreateOrDraft = () => {
  //   const { selectedCourse } = this.props
  //   let selfAssesments = this.state.selectedSelfAssesments
  //   if (this.props.selectedCourse && selfAssesments.length === 0) {
  //     selfAssesments = this.props.selfAssesments.filter(s => s.course_instance_id === parseInt(selectedCourse, 10))
  //   }
  // }

  // if (!this.state.created) {
  // return (
  // <Form>
  //   <Form.Field style={{ marginTop: '20px' }}>
  //     <Dropdown
  //       selection
  //       placeholder={"Valitse kurssi"}
  //       onChange={this.handleDropdownChange}
  //       options={dropDownCourse}
  //       defaultValue={parseInt(selectedCourse)}
  //     />
  //   </Form.Field>
  //   <Form.Field>
  //     <SelfAssesmentList
  //       onClick={this.sendFormId}
  //       selfAssesments={selfAssesments}
  //     />
  //   </Form.Field>
  //   <Form.Field>
  //     <CategorySelection
  //       selectedView={selectedView}
  //       category="category"
  //       objectives="objectives"
  //       toggleButton={this.toggleButton}
  //       sendFormId={this.sendFormId}
  //     />
  //   </Form.Field>
  // </Form>
  // )
  // }

  // return (
  // <SelfAssesmentForm
  //   handleChange={this.handleFormChange}
  //   edit
  //   created
  //   formData={formData}
  // />)
  // }


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
          <CategorySelection
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

SelfAssesmentCreateForm.propTypes = {
  dropDownCourse: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  createForm: PropTypes.func.isRequired
}

SelfAssesmentCreateForm.defaultProps = {
  dropdownAssesments: []
}
export default SelfAssesmentCreateForm
