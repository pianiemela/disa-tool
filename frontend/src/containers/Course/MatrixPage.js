import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getMatrix } from './actions/course'

import Matrix from './components/matrix/Matrix'
import CourseHeader from './components/header/CourseHeader'

class MatrixPage extends Component {
  componentDidMount = () => {
    this.props.getMatrix({
      id: this.props.courseId
    })
  }

  render() {
    if (this.props.loading) {
      return (<Loader active />)
    }
    return (
      <div className="MatrixPage">
        <CourseHeader renderReturnLink={false} />
        <Matrix courseId={this.props.courseId} editing={false} />
      </div>
    )
  }
}

MatrixPage.propTypes = {
  courseId: PropTypes.number.isRequired,
  getMatrix: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.course.loading,
  courseId: Number(ownProps.match.params.id)
})

const mapDispatchToProps = dispatch => ({
  getMatrix: asyncAction(getMatrix, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MatrixPage)
