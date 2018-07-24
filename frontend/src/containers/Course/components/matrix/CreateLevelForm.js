import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addLevel } from '../../services/levels'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateLevelForm extends Component {
  addLevelSubmit = (e) => {
    this.props.addLevel({
      course_instance_id: this.props.courseId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
  }

  render() {
    const contentPrompt = 'Luo uusi oppimistaso'
    return (
      <Table.HeaderCell className="CreateLevelForm">
        <ModalForm
          header="Luo uusi oppimistaso"
          trigger={<Button className="addLevelButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay="nimi" />
              <Button type="submit" color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.addLevelSubmit}
        />
      </Table.HeaderCell>
    )
  }
}

CreateLevelForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addLevel: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addLevel: asyncAction(addLevel, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateLevelForm)
