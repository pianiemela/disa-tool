import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Loader, Table } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'
import './grades.css'

import { getGrades } from '../../actions/grades'

import Gradelist from './Gradelist'
import CreateGradeForm from './CreateGradeForm'
import CategoryGradeTable from './CategoryGradeTable'

class EditGradesTab extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.getGrades({
        id: this.props.courseId
      })
    }
  }

  render() {
    const { courseId, grades, levels, categories, loading } = this.props
    if (loading) return <Loader active />
    return (
      <div className="EditGradesTab">
        <Container>
          <Gradelist
            grades={grades}
            levels={levels}
          />
          <CreateGradeForm
            levels={levels}
            grades={grades}
          />
          <CategoryGradeTable
            courseId={courseId}
            grades={grades}
            levels={levels}
            categories={categories}
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
  levels: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = state => ({
  loading: state.grade.loading,
  levels: state.level.levels,
  grades: state.grade.grades,
  categories: state.category.categories
})

const mapDispatchToProps = dispatch => ({
  getGrades: asyncAction(getGrades, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGradesTab)
