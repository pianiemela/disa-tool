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
    // const courseData = await getCourseData(courseId)
    // const courseInfo = this.props.courses.find(cd => cd.id === courseId)
    // await this.props.dispatchInitNewFormAaction({ courseData, type, courseInfo })
    this.setState({ redirect: true, new: true, courseInstanceId, type })
  }

  editForm = async (id) => {
    await this.props.dispatchEditFormAction({ data: this.props.selfAssesments.find(sa => sa.id === id) })
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

    const { formData } = this.props
    let submitAction = null
    let bText = 'Tallenna'
    if (formData.id) {
      submitAction = this.handleUpdate
      bText = 'Päivitä'
    } else {
      submitAction = this.handleSubmit
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

{/* {!this.state.created ?
            this.renderTeacherView()
            :
            <SelfAssesmentForm
              edit
              created
              formData={formData}
              handleSubmit={submitAction}
              bText={bText}
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
    user: state.user,
    courses: state.courses,
    courseDropdownOptions: createOptions(state.courses),
    selfAssesmentDropdownOptions: createOptions(state.selfAssesment.userSelfAssesments),
    formData: state.selfAssesment.createForm,
    selfAssesments: state.selfAssesment.userSelfAssesments
  }
)

const mapDispatchToProps = dispatch => ({
  dispatchInitNewFormAaction: data =>
    dispatch(initNewFormAaction(data)),
  dispatchCreateForm: data =>
    dispatch(createForm(data)),
  dispatchGetUsercourses: () =>
    dispatch(getUserCoursesAction()),
  dispatchGetUserSelfAssesments: () =>
    dispatch(getUserSelfAssesments()),
  dispatchEditFormAction: data =>
    dispatch(editFormAction(data)),
  dispatchUpdateSelfAssesmentAction: data =>
    dispatch(updateSelfAssesmentAction(data))
})

SelfAssesmentForm.defaultProps = {
  formData: {} || []
}

SelfAssesmentPage.propTypes = {
  courseDropdownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  // selfAssesmentDropdownOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formData: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()),
  PropTypes.shape()]).isRequired,
  dispatchCreateForm: PropTypes.func.isRequired,
  dispatchInitNewFormAaction: PropTypes.func.isRequired,
  courses: PropTypes.PropTypes.arrayOf(PropTypes.shape()).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SelfAssesmentPage)
