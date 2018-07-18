import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, List } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import { getAllSelfAssesments } from '../services/selfAssesment'
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

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    let { active } = this.state
    const opened = active.includes(index)
      ? (active = active.filter(i => i !== index))
      : active.concat(index)
    this.setState({ active: opened })
  }

  handleDropdownChange = (e, { value }) => {
    const selectedSelfAssesments = this.props.selfAssesments.filter(sa => sa.course_instance_id === value)
    this.setState({ selectedSelfAssesments })
    this.setState({ dropDownValue: value })
  }

  sendFormId = (type) => {
    console.log(type, this.state.dropDownValue)
    // this.props.createForm(this.state.dropDownValue, this.state.selectedView)
  }

  toggleButton = (e) => {
    const { value } = e.target
    this.setState({ selectedView: value })
  }

  renderCreateOrDraft = () => {
    const { selectedView, formData } = this.state
    const { dropDownCourse, dropdownAssesments } = this.props
    if (!this.state.created) {
      return (
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={10}>
              <DropDownSelection
                options={dropDownCourse}
                placeholder="Valitse kurssi"
                handleChange={this.handleDropdownChange}
              />

              <SelfAssesmentList
                onClick={this.sendFormId}
                selfAssesments={this.state.selectedSelfAssesments}
              />
              <CategorySelection
                selectedView={selectedView}
                category="category"
                objectives="objectives"
                toggleButton={this.toggleButton}
                sendFormId={this.sendFormId}
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }

    return (<SelfAssesmentForm
      handleChange={this.handleFormChange}
      edit
      created
      formData={formData}
    />)
  }


  render() {
    return <div>{this.renderCreateOrDraft()}</div>
  }
}

SelfAssesmentCreateForm.propTypes = {
  dropDownCourse: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dropdownAssesments: PropTypes.arrayOf(PropTypes.shape()),
  createForm: PropTypes.func.isRequired
}

SelfAssesmentCreateForm.defaultProps = {
  dropdownAssesments: []
}
export default SelfAssesmentCreateForm
