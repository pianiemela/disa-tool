import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, Label, Dropdown } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addGrade } from '../../actions/grades'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class CreateGradeForm extends Component {
  addGradeSubmit = e => this.props.addGrade({
    course_instance_id: this.props.courseId,
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value,
    skill_level_id: e.target.skill_level.value,
    needed_for_grade: e.target.needed_for_grade.value,
    prerequisite: e.target.prerequisite.value
  })

  render() {
    const label = {
      name: 'nimi',
      skill_level: 'oppimistaso',
      needed_for_grade: 'tarvittava suoritus',
      prerequisite: 'esivaatimus'
    }
    return (
      <div className="CreateGradeForm">
        <ModalForm
          header="Luo uusi arvosteluperuste"
          trigger={<Button className="addGradeButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay={label.name} />
              <Form.Field>
                <Label content={label.skill_level} />
                <Dropdown
                  name="skill_level"
                  selection
                  options={this.props.levels.map(level => ({
                    key: level.id,
                    value: level.id,
                    text: level.name
                  }))}
                />
              </Form.Field>
              <Form.Field>
                <Label content={label.needed_for_grade} />
                <Input
                  name="needed_for_grade"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Form.Field>
              <Form.Field>
                <Label content={label.prerequisite} />
                <Dropdown
                  name="prerequisite"
                  selection
                  options={[{ key: 0, value: null, text: '' }].concat(this.props.grades.map(grade => ({
                    key: grade.id,
                    value: grade.id,
                    text: grade.name
                  })))}
                />
              </Form.Field>
              <Button color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addGradeSubmit}
        />
      </div>
    )
  }
}

CreateGradeForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  addGrade: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addGrade: asyncAction(addGrade, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateGradeForm)
