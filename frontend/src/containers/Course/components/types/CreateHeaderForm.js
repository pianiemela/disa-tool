import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addHeader } from '../../actions/types'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateHeaderForm extends Component {
  addHeaderSubmit = (e) => {
    this.props.addHeader({
      course_instance_id: this.props.courseId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
  }

  render() {
    const contentPrompt = 'Lisää uusi tyyppiotsake'
    const label = {
      name: 'nimi'
    }
    return (
      <div className="CreateHeaderForm">
        <ModalForm
          header="Lisää uusi tyyppiotsake"
          trigger={<Button onClick={this.expand} className="addHeaderButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay={label.name} />
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addHeaderSubmit}
        />
      </div>
    )
  }
}

CreateHeaderForm.propTypes = {
  addHeader: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addHeader: asyncAction(addHeader, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateHeaderForm)
