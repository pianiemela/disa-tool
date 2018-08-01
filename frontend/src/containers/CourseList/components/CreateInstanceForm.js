import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { addInstance } from '../services/courseInstances'

import ModalForm from '../../../utils/components/ModalForm'
import MultilingualField from '../../../utils/components/MultilingualField'

export class CreateInstanceForm extends Component {
  addInstanceSubmit = (e) => {
    this.props.addInstance({
      course_id: this.props.course_id,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
  }

  render() {
    const contentPrompt = 'Luo uusi kurssi-instanssi'
    return (
      <div className="CreateInstanceForm">
        <ModalForm
          header="Luo uusi kurssi-instanssi"
          trigger={<Button className="addInstanceButton">Luo uusi instanssi tästä kurssista</Button>}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay="nimi" />
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addInstanceSubmit}
        />
      </div>
    )
  }
}

CreateInstanceForm.propTypes = {
  course_id: PropTypes.number.isRequired,
  addInstance: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addInstance: asyncAction(addInstance, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateInstanceForm)
