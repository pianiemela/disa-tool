import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addType } from '../../actions/types'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'
import InfoBox from '../../../../utils/components/InfoBox'

export class CreateTypeForm extends Component {
  addTypeSubmit = (e) => {
    this.props.addType({
      type_header_id: this.props.headerId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      multiplier: Number(e.target.multiplier.value),
      order: this.props.newOrder
    })
  }

  translate = id => this.props.translate(`Course.types.CreateTypeForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    const label = {
      name: this.translate('name'),
      multiplier: this.translate('multiplier')
    }
    return (
      <div className="CreateTypeForm">
        <ModalForm
          header={<Fragment>{this.translate('header')}<InfoBox translateFunc={this.props.translate} translationid="AddTypeModal" buttonProps={{ floated: 'right' }} /></Fragment>}
          trigger={<Button basic onClick={this.expand} className="addTypeButton" icon={{ name: 'add' }} />}
          actions={saveActions(this.translate)}
          onSubmit={this.addTypeSubmit}
        >
          <p>{contentPrompt}.</p>
          <MultilingualField field="name" fieldDisplay={label.name} />
          <Form.Field inline>
            <Label size="large">{label.multiplier}</Label>
            <Input name="multiplier" type="number" min={0} max={1} step={0.01} />
          </Form.Field>
        </ModalForm>
      </div>
    )
  }
}

CreateTypeForm.propTypes = {
  addType: PropTypes.func.isRequired,
  headerId: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired,
  newOrder: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addType: asyncAction(addType, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(CreateTypeForm))
