import React, { Component } from 'react'
import { Table, Input } from 'semantic-ui-react'

export class CategoryGradeTable extends Component {
  state = {
    updatedGrades: []
  }

  componentDidMount() {
    console.log(this.props.grades)
  }

  findValue = (categoryId, grade) => {
    const { updatedGrades } = this.state
    const updated = updatedGrades.find(ug => ug.gradeId === grade.id && ug.categoryId === categoryId)
    if (updated) {
      return updated.needed_for_grade
    }
    const existing = grade.category_grades.find(cg => cg.category_id === categoryId && cg.grade_id === grade.id)
    if (existing) {
      return existing.needed_for_grade
    }
    return null
  }

  findName = (categoryId, grade) => {
    const { updatedGrades } = this.state
    const updated = updatedGrades.find(ug => ug.gradeId === grade.id && ug.categoryId === categoryId)
    if (updated) {
      return updated.id
    }
    const existing = grade.category_grades.find(cg => cg.category_id === categoryId && cg.grade_id === grade.id)
    if (existing) {
      return existing.id
    }
    return null
  }

  changeValue = (e) => {
    const updatedGrades = [...this.state.updatedGrades]
    const updated = updatedGrades.find(ug => ug.id === Number(e.target.name))
    if (!updated) {
      let original = {}
      for (let i = 0; i < this.props.grades.length; i += 1) {
        const grade = this.props.grades[i]
        const categoryGrade = grade.category_grades.find(cg => cg.id === Number(e.target.name))
        if (categoryGrade) {
          original = categoryGrade
        }
      }
      updatedGrades.push({
        id: original.id,
        gradeId: original.grade_id,
        categoryId: original.category_id,
        needed_for_grade: Number(e.target.value)
      })
      this.setState({ updatedGrades })
    } else {
      updated.needed_for_grade = Number(e.target.value)
      this.setState({ updatedGrades })
    }
  }

  render() {
    const { updatedGrades } = this.state
    // console.log(this.props.grades)
    console.log(this.state)
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Arvosana/Osio</Table.HeaderCell>
            {this.props.grades.map(grade => (
              <Table.HeaderCell>
                {grade.name}
              </Table.HeaderCell>
                ))}
          </Table.Row>
          {this.props.categories.map(category => (
            <Table.Row>
              <Table.Cell>{category.name}</Table.Cell>
              {this.props.grades.map(grade => (
                <Table.HeaderCell>
                  <Input type="number" name={this.findName(category.id, grade)} placeholder="0" value={this.findValue(category.id, grade)} onChange={this.changeValue} />
                </Table.HeaderCell>
                ))}
            </Table.Row>
              ))}
        </Table.Header>
      </Table>
    )
  }
}

CategoryGradeTable.defaultProps = {
  grades: []
}

export default CategoryGradeTable
