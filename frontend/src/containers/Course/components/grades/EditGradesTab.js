import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { getGrades } from '../../actions/grades'

class EditGradesTab extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.getGrades({
        id: this.props.courseId
      })
    }
  }

  render() {
    return (
      <div className="EditGradesTab">
        <Container>
          AAAAAA
        </Container>
      </div>
    )
  }
}

EditGradesTab.propTypes = {
  courseId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  getGrades: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  loading: state.grade.loading,
  levels: state.level.levels,
  grades: state.grade.grades
})

const mapDispatchToProps = dispatch => ({
  getGrades: asyncAction(getGrades, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGradesTab)
