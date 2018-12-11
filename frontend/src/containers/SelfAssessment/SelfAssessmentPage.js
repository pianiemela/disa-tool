import React from 'react'
import { Container, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'
import EditOrNewForm from './Components/EditOrNewform'

import {
  getUserCoursesAction,
  getUserSelfAssesments,
  getCourseInstanceDataAction,
  resetErrorAction
} from '../../actions/actions'


export class SelfAssessmentPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new: false,
      type: '',
      edit: false,
      courseInstanceId: '',
      assessmentId: ''
    }
  }
  async componentDidMount() {
    if (!this.props.role) {
      await this.props.dispatchGetCourseInstanceData(this.props.match.params.courseId)
    }
    this.props.dispatchGetUsercourses()
    this.props.dispatchGetUserSelfAssessments()
  }
  async componentWillUnmount() {
    if (this.props.error) {
      this.props.dispatchClearError()
    }
  }

  createOrEdit = async (e, { id, assessment }) => {
    if (assessment) {
      this.setState({ new: true, courseInstanceId: id, type: assessment })
    } else {
      this.setState({ edit: true, assessmentId: id })
    }
  }
  render() {
    const { role } = this.props
    if (this.props.error || (this.props.role && this.props.role !== 'TEACHER')) {
      return <Redirect to="/user" />
    }
    if (this.state.new) {
      return <Redirect to={`/selfassesment/create/${this.state.courseInstanceId}/${this.state.type}`} />
    }

    if (this.state.edit) {
      return <Redirect to={`/selfassessment/edit/${this.state.assessmentId}`} />
    }

    return (
      <Container>
        <div className="selfAssesmentCreateForm">
          {!role ?
            <Loader active />
            :
            <EditOrNewForm
              courses={this.props.courses}
              dropDownCourse={this.props.courseDropdownOptions}
              selectedCourse={this.props.match.params.courseId}
              selfAssessments={this.props.selfAssessments}
              handleSubmit={this.createOrEdit}
            />
          }
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
    role: state.instance.courseRole,
    courses: state.courses,
    courseDropdownOptions: createOptions(state.courses),
    selfAssesmentDropdownOptions: createOptions(state.selfAssesment.userSelfAssesments),
    formData: state.selfAssesment.createForm,
    selfAssessments: state.selfAssesment.userSelfAssesments,
    error: state.error.redirect
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchGetUsercourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssessments: () =>
    dispatch(getUserSelfAssesments()),
  dispatchGetCourseInstanceData: courseId =>
    dispatch(getCourseInstanceDataAction(courseId)),
  dispatchClearError: () =>
    dispatch(resetErrorAction())


})

SelfAssessmentPage.propTypes = {
  courseDropdownOptions: PropTypes.arrayOf(PropTypes.shape()),
  courses: PropTypes.arrayOf(PropTypes.shape()),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string
    }).isRequired
  }).isRequired,
  selfAssessments: PropTypes.arrayOf(PropTypes.shape()),
  dispatchGetUsercourses: PropTypes.func.isRequired,
  dispatchGetUserSelfAssessments: PropTypes.func.isRequired,
  dispatchGetCourseInstanceData: PropTypes.func.isRequired,
  dispatchClearError: PropTypes.func.isRequired,
  error: PropTypes.bool,
  role: PropTypes.string
}

SelfAssessmentPage.defaultProps = {
  courses: [],
  selfAssessments: [],
  courseDropdownOptions: [],
  role: null,
  error: false

}


export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(SelfAssessmentPage))
