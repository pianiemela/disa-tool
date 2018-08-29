import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { arrayOf, func, number, shape } from 'prop-types'
import { Button, Container, Header, Table, Input } from 'semantic-ui-react'

import { updateCategoryGradesAction } from '../../../../actions/actions'

export class CategoryGradeTable extends Component {
  state = {
    updatedGrades: []
  }

  findValue = (categoryId, grade) => {
    const { updatedGrades } = this.state
    const updated = updatedGrades.find(ug =>
      ug.gradeId === grade.id && ug.categoryId === categoryId)
    if (updated) {
      return updated.neededForGrade
    }
    const existing = grade.category_grades.find(cg =>
      cg.category_id === categoryId && cg.grade_id === grade.id)
    if (existing) {
      return existing.needed_for_grade
    }
    return null
  }

  findName = (categoryId, grade) => {
    const { updatedGrades } = this.state
    const updated = updatedGrades.find(ug =>
      ug.gradeId === grade.id && ug.categoryId === categoryId)
    if (updated) {
      return updated.id
    }
    const existing = grade.category_grades.find(cg =>
      cg.category_id === categoryId && cg.grade_id === grade.id)
    if (existing) {
      return existing.id
    }
    return null
  }

  changeValue = (e) => {
    const updatedGrades = [...this.state.updatedGrades]
    const categoryGradeId = Number(e.target.name)
    const categoryGradeValue = Number(e.target.value)
    const updated = updatedGrades.find(ug => ug.id === categoryGradeId)
    if (!updated) {
      let original = {}
      for (let i = 0; i < this.props.grades.length; i += 1) {
        const grade = this.props.grades[i]
        const categoryGrade = grade.category_grades.find(cg => cg.id === categoryGradeId)
        if (categoryGrade) {
          original = categoryGrade
        }
      }
      updatedGrades.push({
        id: original.id,
        gradeId: original.grade_id,
        categoryId: original.category_id,
        neededForGrade: categoryGradeValue
      })
      this.setState({ updatedGrades })
    } else {
      updated.neededForGrade = categoryGradeValue
      this.setState({ updatedGrades })
    }
  }

  cancelChanges = () => this.setState({ updatedGrades: [] })

  submitChanges = () => {
    this.props.dispatchUpdateCategoryGrades({
      courseId: this.props.courseId,
      categoryGrades: this.state.updatedGrades
    })
    this.setState({ updatedGrades: [] })
  }

  render() {
    return (
      <Container>
        <Header as="h3" content={this.props.translate('Course.grades.CategoryGradeTable.header')} />
        <Table definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.props.translate('Course.grades.CategoryGradeTable.header_cell')}</Table.HeaderCell>
              {this.props.grades.map(grade => (
                <Table.HeaderCell key={grade.id}>
                  {grade.name}
                </Table.HeaderCell>
                  ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.categories.map(category => (
              <Table.Row key={category.id}>
                <Table.Cell>{category.name}</Table.Cell>
                {this.props.grades.map(grade => (
                  <Table.Cell key={this.findName(category.id, grade)}>
                    <Input
                      type="number"
                      max="1"
                      min="0"
                      name={this.findName(category.id, grade)}
                      placeholder="0"
                      step="0.05"
                      value={this.findValue(category.id, grade)}
                      onChange={this.changeValue}
                    />
                  </Table.Cell>
                  ))}
              </Table.Row>
                ))}
          </Table.Body>
        </Table>
        <Button color="green" content={this.props.translate('common.save')} onClick={this.submitChanges} />
        <Button color="red" content={this.props.translate('Course.grades.CategoryGradeTable.cancel_button')} onClick={this.cancelChanges} />
      </Container>
    )
  }
}

CategoryGradeTable.defaultProps = {
  grades: [],
  categories: []
}

CategoryGradeTable.propTypes = {
  categories: arrayOf(shape()),
  courseId: number.isRequired,
  grades: arrayOf(shape()),
  dispatchUpdateCategoryGrades: func.isRequired,
  translate: func.isRequired
}

export default connect(null, {
  dispatchUpdateCategoryGrades: updateCategoryGradesAction
})(withLocalize(CategoryGradeTable))
