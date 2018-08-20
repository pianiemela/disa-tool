import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { details } from '../../../../api/objectives'
import { editObjective } from '../../actions/objectives'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class EditObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      values: {
        name: {
          eng: '',
          fin: '',
          swe: ''
        }
      }
    }
  }

  editObjectiveSubmit = e => this.props.editObjective({
    id: this.props.objectiveId,
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value
  })

  loadDetails = async () => {
    const objectiveDetails = (await this.props.details({
      id: this.props.objectiveId
    })).data.data
    this.setState({
      loading: false,
      values: {
        name: {
          eng: objectiveDetails.eng_name,
          fin: objectiveDetails.fin_name,
          swe: objectiveDetails.swe_name
        }
      }
    })
  }

  render() {
    return (
      <div className="EditObjectiveForm">
        <ModalForm
          header="Muokkaa oppimistavoitetta"
          trigger={<Button onClick={this.loadDetails} icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay="nimi" values={this.state.values.name} />
              <Button color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.editObjectiveSubmit}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

EditObjectiveForm.propTypes = {
  editObjective: PropTypes.func.isRequired,
  objectiveId: PropTypes.number.isRequired,
  details: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editObjective: asyncAction(editObjective, dispatch),
  details
})

export default connect(null, mapDispatchToProps)(EditObjectiveForm)
