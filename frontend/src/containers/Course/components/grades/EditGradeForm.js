import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, Dropdown, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { details } from '../../../../api/grades'
import { editGrade } from '../../actions/grades'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class EditGradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      values: {
        name: {
          eng: '',
          fin: '',
          swe: ''
        },
        skill_level: null,
        needed_for_grade: 0,
        prerequisite: null
      }
    }
  }

  editGradeSubmit = e => this.props.editGrade({
    id: this.props.gradeId,
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value,
    skill_level_id: this.state.values.skill_level,
    needed_for_grade: this.state.values.needed_for_grade,
    prerequisite: this.state.values.prerequisite
  })

  loadDetails = async () => {
    if (!this.state.loading) return
    const gradeDetails = (await this.props.details({ id: this.props.gradeId })).data.data
    this.setState({
      loading: false,
      values: {
        name: {
          eng: gradeDetails.eng_name,
          fin: gradeDetails.fin_name,
          swe: gradeDetails.swe_name
        },
        skill_level: gradeDetails.skill_level_id,
        needed_for_grade: gradeDetails.needed_for_grade,
        prerequisite: gradeDetails.prerequisite
      }
    })
  }

  changeValue = field => (e, { value }) => this.setState({
    values: {
      ...this.state.values,
      [field]: value
    }
  })

  render() {
    const label = {
      name: 'nimi',
      skill_level: 'oppimistaso',
      needed_for_grade: 'vaadittu suoritus',
      prerequisite: 'esivaatimus'
    }
    return (
      <div className="EditGradeForm">
        <ModalForm
          header="Muokkaa arvosteluperustetta"
          trigger={<Button icon={{ name: 'edit' }} size="small" onClick={this.loadDetails} />}
          content={
            <div>
              <MultilingualField
                field="name"
                fieldDisplay={label.name}
                values={this.state.values.name}
              />
              <Form.Field>
                <Label content={label.skill_level} />
                <Dropdown
                  value={this.state.values.skill_level}
                  onChange={this.changeValue('skill_level')}
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
                  value={this.state.values.needed_for_grade}
                  onChange={this.changeValue('needed_for_grade')}
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Form.Field>
              <Form.Field>
                <Label content={label.prerequisite} />
                <Dropdown
                  value={this.state.values.prerequisite}
                  onChange={this.changeValue('prerequisite')}
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
          onSubmit={this.editGradeSubmit}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

EditGradeForm.propTypes = {
  details: PropTypes.func.isRequired,
  editGrade: PropTypes.func.isRequired,
  gradeId: PropTypes.number.isRequired,
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
}

const mapDispatchToProps = dispatch => ({
  details,
  editGrade: asyncAction(editGrade, dispatch)
})

export default connect(null, mapDispatchToProps)(EditGradeForm)
