import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Form, Input, Label, Dropdown } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addGrade } from '../../actions/grades'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class CreateGradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {}
    }
  }

  addGradeSubmit = e => this.props.addGrade({
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value,
    skill_level_id: this.state.values.skill_level,
    needed_for_grade: e.target.needed_for_grade.value,
    prerequisite: this.state.values.prerequisite
  })

  changeDropdown = field => (e, { value }) => this.setState({
    values: {
      ...this.state.values,
      [field]: value
    }
  })

  translate = id => this.props.translate(`Course.grades.CreateGradeForm.${id}`)

  render() {
    const label = {
      name: this.translate('name'),
      skill_level: this.translate('skill_level'),
      needed_for_grade: this.translate('needed_for_grade'),
      prerequisite: this.translate('prerequisite')
    }
    return (
      <div className="CreateGradeForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic className="addGradeButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay={label.name} />
              <Form.Field>
                <Label content={label.skill_level} />
                <Dropdown
                  value={this.state.values.skill_level}
                  onChange={this.changeDropdown('skill_level')}
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
                  value={this.state.values.prerequisite}
                  onChange={this.changeDropdown('prerequisite')}
                  selection
                  options={[{ key: 0, value: null, text: '' }].concat(this.props.grades.map(grade => ({
                    key: grade.id,
                    value: grade.id,
                    text: grade.name
                  })))}
                />
              </Form.Field>
              <Button color="green">{this.translate('save')}</Button>
            </div>
          }
          onSubmit={this.addGradeSubmit}
        />
      </div>
    )
  }
}

CreateGradeForm.propTypes = {
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  addGrade: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addGrade: asyncAction(addGrade, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(CreateGradeForm))
