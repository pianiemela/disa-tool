import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { headerDetails } from '../../../../api/types'
import { editHeader } from '../../actions/types'

import ModalForm from '../../../../utils/components/ModalForm'
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

  render() {
    return (
      <div className="EditHeaderForm">
        <ModalForm
          header="Muokkaa oppimistavoitetta"
          trigger={<Button onClick={this.loadDetails} icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay="nimi" values={this.state.values.name} />
              <Button color="green">Tallenna</Button>
            </div>
          }
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
  headerDetails: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editHeader: asyncAction(editHeader, dispatch),
  headerDetails
})

export default connect(null, mapDispatchToProps)(EditHeaderForm)
