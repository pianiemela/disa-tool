import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from '../Course/services/course'

import Matrix from './components/matrix/Matrix'

class EditMatrixPage extends Component {
  componentDidMount() {
    this.props.getCourseData({
      courseId: this.props.courseId
    })
  }

  render() {
    if (this.props.loading) {
      return <Loader active />
    }
    return (
      <div>
        <Matrix courseId={this.props.course.id} editing />
      </div>
    )
  }
}

EditMatrixPage.propTypes = {
  courseId: PropTypes.number.isRequired,
  course: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  getCourseData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  course: state.course.course,
  loading: state.course.loading
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMatrixPage)
