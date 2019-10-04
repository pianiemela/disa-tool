import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Loader, Button, Container, Segment } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getMatrix, resetCourse } from './actions/course'

import Matrix from './components/matrix/Matrix'
import CourseHeader from './components/header/CourseHeader'
import Conditional from '../../utils/components/Conditional'
import { getCourseInstanceDataAction } from '../../actions/actions'

class MatrixPage extends Component {
  componentDidMount = () => {
    this.props.updateCourseInfo(this.props.courseId)
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
        <Conditional visible={this.props.isTeacher}>
          <Button as={Link} to={`/course/${this.props.courseId}/matrix`} fluid style={{ marginBottom: '10px' }}>Edit matrix</Button>
        </Conditional>
        <Container>
          <Segment style={{ overflowX: 'auto', padding: 'none' }}>
            <div style={{ overflow: 'overlay' }}>
              <Matrix courseId={this.props.courseId} editing={false} categoryId={this.props.categoryId} />
            </div>
          </Segment>
        </Container>
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
  categoryId: PropTypes.number,
  updateCourseInfo: PropTypes.func.isRequired,
  isTeacher: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.course.loading,
  courseId: ownProps.match ? Number(ownProps.match.params.id) : ownProps.courseId,
  isTeacher: state.instance.courseRole === 'TEACHER'
})

const mapDispatchToProps = dispatch => ({
  getMatrix: asyncAction(getMatrix, dispatch),
  resetCourse: resetCourse(dispatch),
  updateCourseInfo: courseId => dispatch(getCourseInstanceDataAction(courseId))
})

export default connect(mapStateToProps, mapDispatchToProps)(MatrixPage)
