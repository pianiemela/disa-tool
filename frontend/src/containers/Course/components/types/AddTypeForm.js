import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addType } from '../../services/types'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class AddTypeForm extends Component {
  addTypeSubmit = (e) => {
    this.props.addType({
      courseId: this.props.courseId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      sve_name: e.target.sve_name.value
    })
  }

  render() {
    const contentPrompt = 'Lisää uusi tyyppi'
    const label = 'nimi'
    return (
      <div className="addTypeForm">
        <ModalForm
          header="Lisää uusi tyyppi"
          trigger={<Button onClick={this.expand} className="addTypeButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay={label} />
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addTypeSubmit}
        />
      </div>
    )
  }
}

AddTypeForm.propTypes = {
  addType: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addType: asyncAction(addType, dispatch)
})

export default connect(null, mapDispatchToProps)(AddTypeForm)
