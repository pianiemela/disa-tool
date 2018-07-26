import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

import SelfAssesmentCreateForm from './CreateForm/SelfAssesmentCreateForm'
import { getCourseData } from './services/createForm'
import SelfAssesmentForm from './Userform/SelfAssesmentForm'


import {
  initNewFormAaction,
  createForm,
  getUserCoursesAction,
  getUserSelfAssesments,
  editFormAction,
  updateSelfAssesmentAction
} from '../../actions/actions'

export class SelfAssesmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new: false,
      type: '',
      edit: false,
      courseInstanceId: '',
      assesmentId: ''
    }
  }
  async componentDidMount() {
    this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssesments()
  }
  createForm = async (courseInstanceId, type) => {
    this.setState({ redirect: true, new: true, courseInstanceId, type })
  }

  editForm = async (id) => {
    this.setState({ redirect: true, edit: true, assesmentId: id })
  }
  render() {
    if (this.state.new && this.state.redirect) {
      console.log(`redirecting to create page...`)
      return <Redirect to={`/selfassesment/create/${this.state.courseInstanceId}/${this.state.type}`} />
    }

    if (this.state.edit && this.state.redirect) {
      console.log(`redirecting to edit page...`)
      return <Redirect to={`/selfassesment/edit/${this.state.assesmentId}`} />
    }

    return (
      <Container>
        <div>
          <SelfAssesmentCreateForm
            courses={this.props.courses}
            dropDownCourse={this.props.courseDropdownOptions}
            selectedCourse={this.props.match.params.courseId}
            selfAssesments={this.props.selfAssesments}
            createForm={this.createForm}
            editForm={this.editForm}
          />
        </div>
      </Container>
    )
  }
}

const createOptions = (data) => {
  const options = []
  data.map(d =>
    options.push({ value: d.id, text: d.name }))
  return options
}
const mapStateToProps = state => (
  {
    user: state.user,
    courses: state.courses,
    courseDropdownOptions: createOptions(state.courses),
    selfAssesmentDropdownOptions: createOptions(state.selfAssesment.userSelfAssesments),
    formData: state.selfAssesment.createForm,
    selfAssesments: state.selfAssesment.userSelfAssesments
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchGetUsercourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssesments: () =>
    dispatch(getUserSelfAssesments())
})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}

SelfAssesmentPage.propTypes = {
  courseDropdownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  courses: PropTypes.PropTypes.arrayOf(PropTypes.shape()).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
