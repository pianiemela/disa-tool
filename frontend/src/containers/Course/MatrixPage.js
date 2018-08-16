import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getMatrix, resetCourse } from './actions/course'

import Matrix from './components/matrix/Matrix'
import CourseHeader from './components/header/CourseHeader'

class MatrixPage extends Component {
  componentDidMount = () => {
    this.props.getMatrix({
      id: this.props.courseId
    })
  }

  componentWillUnmount() {
    this.props.resetCourse()
  }

  render() {
    if (this.props.loading) {
      return (<Loader active />)
    }
    return (
      <div className="MatrixPage">
        {this.props.hideHeader ? null : <CourseHeader renderReturnLink={false} />}
        <Matrix courseId={this.props.courseId} editing={false} categoryId={this.props.categoryId} />
      </div>
    )
  }
}


MatrixPage.defaultProps = {
  hideHeader: false,
  categoryId: null
}

MatrixPage.propTypes = {
  courseId: PropTypes.number.isRequired,
  getMatrix: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  resetCourse: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool,
  categoryId: PropTypes.number
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.course.loading,
  courseId: ownProps.match ? Number(ownProps.match.params.id) : ownProps.courseId
})

const mapDispatchToProps = dispatch => ({
  getMatrix: asyncAction(getMatrix, dispatch),
  resetCourse: resetCourse(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MatrixPage)
