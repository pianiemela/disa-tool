import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Loader } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { getGrades } from '../../actions/grades'

import Gradelist from './Gradelist'

class EditGradesTab extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.getGrades({
        id: this.props.courseId
      })
    }
  }

  render() {
    if (this.props.loading) return <Loader active />
    return (
      <div className="EditGradesTab">
        <Container>
          <Gradelist
            grades={this.props.grades}
            levels={this.props.levels}
          />
        </Container>
      </div>
    )
  }
}

EditGradesTab.propTypes = {
  courseId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  getGrades: PropTypes.func.isRequired,
  grades: PropTypes.arrayOf(PropTypes.object).isRequired,
  levels: PropTypes.arrayOf(PropTypes.object).isRequired
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
