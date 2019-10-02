import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Container, Segment, Loader, Header } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'
import './grades.css'

import { getGrades } from '../../actions/grades'

import Gradelist from './Gradelist'
import CategoryGradeTable from './CategoryGradeTable'
import InfoBox from '../../../../utils/components/InfoBox'

class EditGradesTab extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.getGrades({
        id: this.props.courseId
      })
    }
  }

  translate = id => this.props.translate(`Course.grades.EditGradesTab.${id}`)

  render() {
    const { courseId, grades, levels, categories, loading } = this.props
    if (loading) return <Loader active />
    return (
      <div className="EditGradesTab">
        <Container>
          <Segment>
            <InfoBox translationid="EditGradesPage" buttonProps={{ floated: 'right' }} />
            <Header
              as="h1"
              content={this.translate('header')}
            />
            <Gradelist
              grades={grades}
              levels={levels}
            />
          </Segment>
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
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired
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

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(EditGradesTab))
