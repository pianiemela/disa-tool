import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { headerDetails } from '../../../../api/types'
import { editHeader } from '../../actions/types'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class EditHeaderForm extends Component {
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

  editHeaderSubmit = e => this.props.editHeader({
    id: this.props.headerId,
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value
  })

  loadDetails = async () => {
    const details = (await this.props.headerDetails({
      id: this.props.headerId
    })).data.data
    this.setState({
      loading: false,
      values: {
        name: {
          eng: details.eng_name,
          fin: details.fin_name,
          swe: details.swe_name
        }
      }
    })
  }

  translate = id => this.props.translate(`Course.types.EditHeaderForm.${id}`)

  render() {
    return (
      <div className="EditHeaderForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic circular onClick={this.loadDetails} icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay={this.translate('name')} values={this.state.values.name} />
            </div>
          }
          actions={saveActions(this.translate)}
          onSubmit={this.editHeaderSubmit}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

EditHeaderForm.propTypes = {
  editHeader: PropTypes.func.isRequired,
  headerId: PropTypes.number.isRequired,
  headerDetails: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editHeader: asyncAction(editHeader, dispatch),
  headerDetails
})

export default withLocalize(connect(null, mapDispatchToProps)(EditHeaderForm))
