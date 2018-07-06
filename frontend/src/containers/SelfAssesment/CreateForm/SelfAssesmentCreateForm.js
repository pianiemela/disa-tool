import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import { getCourseData } from '../services/createForm'
import { getAllSelfAssesments } from '../services/selfAssesment'
import { createFormJSONStucture } from '../reducers/createFormReducer'
import CategorySelection from './CategorySelection'
import EditAssesmentSelection from './EditAssesmentSelection'

class SelfAssesmentCreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: [], selectedView: '', createdForm: {}, created: false }
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

  handleFormChange = (id, type, upOrDown) => {
    const toChange = this.state.createdForm
    switch (type) {
      case 'textfield': {
        console.log(`wut wut noniin tesktikenttä muuttuu`)
        toChange.questionModules = toChange.questionModules.map(o =>
          (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
        this.setState({ createdForm: toChange })
        break
      }
      case 'changeOrder': {
        const a = toChange.questionModules.findIndex(x => x.id === id)
        const b = toChange.questionModules[a]
        if (upOrDown === 'down' && a < toChange.questionModules.length - 1) {
          toChange.questionModules[a] = toChange.questionModules[a + 1]
          toChange.questionModules[a + 1] = b
        } else if (upOrDown === 'up' && a > 0) {
          toChange.questionModules[a] = toChange.questionModules[a - 1]
          toChange.questionModules[a - 1] = b
        }
        this.setState({ createdForm: toChange })
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
          answers: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
        }))
    }
    this.setState({ created: true, createdForm: data })
  }

  createDropdownOptions = () => {
    let options = []
    this.props.selfAssesments.map(sA =>
      options.push({ value: sA.id, text: sA.fin_name }))
    return options
  }

  renderCreateOrDraft = () => {
    const { selectedView, createdForm } = this.state
    if (!this.state.created) {
      return (
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <CategorySelection
                selectedView={selectedView}
                category="category"
                objectives="objectives"
                toggleButton={this.toggleButton}
                createForm={this.createForm}
              />
            </Grid.Column>
            <Grid.Column>
              <EditAssesmentSelection
                onChange={this.changeEditValue}
                options={this.createDropdownOptions()}
              />
            </Grid.Column>
          </Grid.Row>

        </Grid>
      )
    }
    return <SelfAssesmentForm handleChange={this.handleFormChange} edit={true} created={true} createdForm={createdForm} />
  }

  render() {
    this.createDropdownOptions()
    return <div>{this.renderCreateOrDraft()}</div>
  }
}

const mapStateToProps = state => (
  {
    courseData: state.createForm.courseData,
    category: state.createForm.category,
    objectives: state.createForm.objectives,
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
