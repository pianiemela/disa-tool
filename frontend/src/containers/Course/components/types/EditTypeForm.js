import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editType } from '../../actions/types'
import { details } from '../../../../api/types'

import ModalForm from '../../../../utils/components/ModalForm'
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

  render() {
    const contentPrompt = 'Muokkaa tyyppiä'
    const label = {
      name: 'nimi',
      multiplier: 'kerroin'
    }
    return (
      <div className="EditTypeForm">
        <ModalForm
          header="Muokkaa tyyppiä"
          trigger={<Button onClick={this.loadDetails} className="editTypeButton" icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay={label.name} values={this.state.values.name} />
              <Form.Field inline>
                <Label>{label.multiplier}</Label>
                <Input
                  name="multiplier"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={this.state.values.multiplier}
                  onChange={e => this.setState({ values: { ...this.state.values, multiplier: e.target.value } })}
                />
              </Form.Field>
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.editTypeSubmit}
        />
      </div>
    )
  }
}

EditTypeForm.propTypes = {
  editType: PropTypes.func.isRequired,
  details: PropTypes.func.isRequired,
  typeId: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  editType: asyncAction(editType, dispatch),
  details
})

export default connect(null, mapDispatchToProps)(EditTypeForm)
