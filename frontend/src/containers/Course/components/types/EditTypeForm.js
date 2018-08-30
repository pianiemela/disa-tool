import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editType } from '../../actions/types'
import { details } from '../../../../api/types'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class EditTypeForm extends Component {
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
        multiplier: 0
      }
    }
  }

  editTypeSubmit = (e) => {
    this.props.editType({
      id: this.props.typeId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      multiplier: Number(e.target.multiplier.value)
    })
    this.setState({
      loading: true
    })
  }

  loadDetails = async () => {
    const typeDetails = (await this.props.details({
      id: this.props.typeId
    })).data.data
    this.setState({
      values: {
        name: {
          eng: typeDetails.eng_name,
          fin: typeDetails.fin_name,
          swe: typeDetails.swe_name
        },
        multiplier: typeDetails.multiplier
      },
      loading: false
    })
  }

  translate = id => this.props.translate(`Course.types.EditTypeForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    const label = {
      name: this.translate('name'),
      multiplier: this.translate('multiplier')
    }
    return (
      <div className="EditTypeForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic circular onClick={this.loadDetails} className="editTypeButton" icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay={label.name} values={this.state.values.name} />
              <Form.Field inline>
                <Label size="large">{label.multiplier}</Label>
                <Input
                  name="multiplier"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={this.state.values.multiplier}
                  onChange={e => this.setState({
                    values: { ...this.state.values, multiplier: e.target.value }
                  })}
                />
              </Form.Field>
            </div>
          }
          actions={saveActions(this.translate)}
          onSubmit={this.editTypeSubmit}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

EditTypeForm.propTypes = {
  editType: PropTypes.func.isRequired,
  details: PropTypes.func.isRequired,
  typeId: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editType: asyncAction(editType, dispatch),
  details
})

export default withLocalize(connect(null, mapDispatchToProps)(EditTypeForm))
