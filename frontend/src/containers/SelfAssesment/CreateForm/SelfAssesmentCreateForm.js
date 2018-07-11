import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Form } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import { getAllSelfAssesments } from '../services/selfAssesment'
import { createFormJSONStucture } from '../reducers/createFormReducer'
import CategorySelection from './CategorySelection'
import DropDownSelection from './DropDownSelection'

class SelfAssesmentCreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: [],
      selectedView: '',
      dropDownValue: ''
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
    this.setState({ dropDownValue: value })
  }

  sendFormId = () => {
    this.props.createForm(this.state.dropDownValue, this.state.selectedView)
  }

  handleFormChange = (formChange) => {
    const { id, type, questionData } = formChange
    const toChange = this.state.formData
    const a = toChange.questionModules.findIndex(x => x.id === id)
    const b = toChange.questionModules[a]

    switch (type) {
      case 'textfield': {
        toChange.questionModules = toChange.questionModules.map(o =>
          (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
        this.setState({ formData: toChange })
        break
      }
      case 'changeOrderDown': {
        if (a < toChange.questionModules.length - 1) {
          toChange.questionModules[a] = toChange.questionModules[a + 1]
          toChange.questionModules[a + 1] = b
        }
        this.setState({ formData: toChange })
        break
      }
      case 'changeOrderUp': {
        if (a > 0) {
          toChange.questionModules[a] = toChange.questionModules[a - 1]
          toChange.questionModules[a - 1] = b
        }
        this.setState({ formData: toChange })
        break
      }
      case 'addQuestion': {
        if (toChange.openQuestions.length > 0) {
          toChange.openQuestions = toChange.openQuestions.concat({
            id: toChange.openQuestions[toChange.openQuestions.length - 1].id + 1,
            name: questionData
          })
        } else {
          toChange.openQuestions = toChange.openQuestions.concat({
            id: (parseInt(toChange.finalGrade.id) + 1).toString(),
            name: questionData
          })
        }
        this.setState({ formData: toChange })
        break
      }
      case 'removeQuestion': {
        toChange.openQuestions = toChange.openQuestions.filter(oQ => oQ.id !== id)
        this.setState({ formData: toChange })
        break
      }

      default:
    }
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
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <DropDownSelection
                options={dropDownCourse}
                placeholder="Valitse kurssi"
                handleChange={this.handleDropdownChange}
              />

              <CategorySelection
                selectedView={selectedView}
                category="category"
                objectives="objectives"
                toggleButton={this.toggleButton}
                sendFormId={this.sendFormId}
              />

            </Grid.Column>
            <Grid.Column>
              <DropDownSelection
                options={[]}
                placeholder="Valitse muokattava itsearviointi"
                submitButton
                label="Muokkaa"
                onSubmit={this.changeEditValue}
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


const mapStateToProps = state => (
  {
    selfAssesments: state.createForm.selfAssesments,
  }
)

const mapDispatchToProps = dispatch => (
  {
    createFormJSONStucture: createFormJSONStucture(dispatch),
    getAllSelfAssesments: asyncAction(getAllSelfAssesments, dispatch)
  }
)

SelfAssesmentCreateForm.propTypes = {
  getCourseData: PropTypes.func.isRequired,
  getAllSelfAssesments: PropTypes.func.isRequired,
  courseData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selfAssesments: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfAssesmentCreateForm)
