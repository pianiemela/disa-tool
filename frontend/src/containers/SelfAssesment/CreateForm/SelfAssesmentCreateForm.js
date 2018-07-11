import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Form } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import { getCourseData } from '../services/createForm'
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
      formData: {},
      created: false
    }
  }

  componentWillMount() {
    this.props.getCourseData()
    this.props.getAllSelfAssesments()
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    let { active } = this.state
    const opened = active.includes(index)
      ? (active = active.filter(i => i !== index))
      : active.concat(index)
    this.setState({ active: opened })
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
        console.log(toChange)
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

  createForm = () => {
    const data = {}
    const { courseData } = this.props
    data.name = 'Linis'
    data.type = this.state.selectedView
    data.openQuestions = []
    const id = (parseInt(courseData.reduce((c, d) => (c.id > d.id ? c : d)).id) + 1).toString()

    data.finalGrade = [{
      name: 'Anna itsellesi loppuarvosana kurssista',
      eng_name: 'Give yourself a final grade for the course',
      swe_name: 'Låta en final grad till själv, lmao ei näin :D',
      textFieldOn: true,
      id
    }]
    if (data.type === 'category') {
      data.questionModules = []
      courseData.map(ciO =>
        data.questionModules.push({
          id: ciO.id,
          name: ciO.name,
          textFieldOn: true
        }))
    } else {
      data.questionModules = []
      courseData.map(ciO =>
        data.questionModules.push({
          id: ciO.id,
          name: ciO.name,
          objectives: ciO.objectives.map(o => ({
            id: o.id,
            name: o.name
          })),
          options: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
        }))
    }
    this.setState({ created: true, formData: data })
  }

  createDropdownOptions = () => {
    const options = []
    this.props.selfAssesments.map(sA =>
      options.push({ value: sA.id, text: sA.fin_name }))
    return options
  }

  renderCreateOrDraft = () => {
    const { selectedView, formData } = this.state
    if (!this.state.created) {
      return (
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <DropDownSelection
                onChange={this.changeEditValue}
                options={this.createDropdownOptions}
                placeholder="Valitse kurssi"
              />

              <CategorySelection
                selectedView={selectedView}
                category="category"
                objectives="objectives"
                toggleButton={this.toggleButton}
                createForm={this.createForm}
              />

            </Grid.Column>
            <Grid.Column>
              <DropDownSelection
                onChange={this.changeEditValue}
                options={this.createDropdownOptions()}
                placeholder="Valitse muokattava itsearviointi"
                modify
                label="Muokkaa"
                submit={this.changeEditValue}
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
    this.createDropdownOptions()
    return <div>{this.renderCreateOrDraft()}</div>
  }
}

const mapStateToProps = state => (
  {
    selfAssesments: state.createForm.selfAssesments
  }
)

const mapDispatchToProps = dispatch => (
  {
    getCourseData: asyncAction(getCourseData, dispatch),
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
