import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addType } from '../../services/types'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateTypeForm extends Component {
  addTypeSubmit = (e) => {
    this.props.addType({
      course_instance_id: this.props.courseId,
      eng_header: e.target.eng_header.value,
      fin_header: e.target.fin_header.value,
      swe_header: e.target.swe_header.value,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      multiplier: Number(e.target.multiplier.value)
    })
  }

  render() {
    const contentPrompt = 'Lisää uusi tyyppi'
    const label = {
      header: 'otsikko',
      name: 'nimi',
      multiplier: 'kerroin'
    }
    return (
      <div className="CreateTypeForm">
        <ModalForm
          header="Lisää uusi tyyppi"
          trigger={<Button onClick={this.expand} className="addTypeButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="header" fieldDisplay={label.header} />
              <MultilingualField field="name" fieldDisplay={label.name} />
              <Form.Field inline>
                <Label>{label.multiplier}</Label>
                <Input name="multiplier" type="number" min={0} max={1} step={0.01} />
              </Form.Field>
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addTypeSubmit}
        />
      </div>
    )
  }
}

CreateTypeForm.propTypes = {
  addType: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addType: asyncAction(addType, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateTypeForm)
