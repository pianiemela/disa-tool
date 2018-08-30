import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { details } from '../../../../api/objectives'
import { editObjective } from '../../actions/objectives'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
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

  translate = id => this.props.translate(`Course.matrix.EditObjectiveForm.${id}`)

  render() {
    return (
      <div className="EditObjectiveForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic circular onClick={this.loadDetails} icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay={this.translate('name')} values={this.state.values.name} />
            </div>
          }
          actions={saveActions(this.translate)}
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
  details: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editObjective: asyncAction(editObjective, dispatch),
  details
})

export default withLocalize(connect(null, mapDispatchToProps)(EditObjectiveForm))
