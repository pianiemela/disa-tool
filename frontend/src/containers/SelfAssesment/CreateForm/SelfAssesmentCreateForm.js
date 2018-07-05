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
import EditAssesmentSelection from './EditAssesmentSelection';

class SelfAssesmentCreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: [], selectedView: '', createdForm: {}, editForm: '' }
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

  toggleButton = (e) => {
    const { value } = e.target
    this.setState({ selectedView: value })
  }

  createForm = () => {
    const data = {}
    const { courseInstance } = this.props.courseData
    data.fin_name = courseInstance.fin_name
    data.swe_name = courseInstance.fin_name
    data.eng_name = courseInstance.fin_name
    data.type = this.state.selectedView

    if (data.type === 'category') {
      data.questionModules = []
      courseInstance.course_instance_objectives.map(ciO =>
        data.questionModules.push({
          id: ciO.id,
          fin_name: ciO.category,
          swe_name: ciO.category,
          eng_name: ciO.category,
          textFieldOn: true
        }))
    } else {
      data.questionModules = []
      courseInstance.course_instance_objectives.map(ciO =>
        data.questionModules.push({
          id: ciO.id,
          fin_name: ciO.category,
          swe_name: ciO.category,
          eng_name: ciO.category,
          objectives: ciO.objectives.map(o => ({
            fin_name: o,
            swe_name: o,
            eng_name: o
          })),
          answers: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
        }))
    }
    this.setState({ created: true, createdForm: data })
  }

  editValue = () => {

  }

  createDropdownOptions = () => {
    let options = []
    this.props.selfAssesments.map(sA =>
      console.log(sA)
    )
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
                options={[{ text: 'mock', value: 1 }]}
              />
            </Grid.Column>
          </Grid.Row>

        </Grid>
      )
    }
    return <SelfAssesmentForm justCreated={true} createdForm={createdForm} />
  }

  render() {
    console.log(this.props)
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
  courseData: PropTypes.shape({
    courseInstance: PropTypes.shape({
      course_instance_objectives: PropTypes.array,
      fin_name: PropTypes.string,
      swe_name: PropTypes.string,
      eng_name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  selfAssesments: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfAssesmentCreateForm)
