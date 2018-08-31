import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addLevel } from '../../actions/levels'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
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

  translate = id => this.props.translate(`Course.matrix.CreateLevelForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    return (
      <Table.HeaderCell className="CreateLevelForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic className="addLevelButton" icon={{ name: 'add' }} />}
          actions={saveActions(this.translate)}
          onSubmit={this.addLevelSubmit}
        >
          <p>{contentPrompt}.</p>
          <MultilingualField field="name" fieldDisplay={this.translate('name')} />
        </ModalForm>
      </Table.HeaderCell>
    )
  }
}

CreateLevelForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addLevel: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addLevel: asyncAction(addLevel, dispatch)
})

export default connect(null, mapDispatchToProps)(withLocalize(CreateLevelForm))
