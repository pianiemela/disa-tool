import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Icon } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { addInstance } from '../actions/courseInstances'

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

  translate = id => this.props.translate(`CourseList.CreateInstanceForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    return (
      <div className="CreateInstanceForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<span><Icon name="add" />{this.translate('trigger')}</span>}
          onSubmit={this.addInstanceSubmit}
        >
          <p>{contentPrompt}.</p>
          <MultilingualField field="name" fieldDisplay={this.translate('name')} />
          <Button type="submit" color="green">{this.translate('save')}</Button>
        </ModalForm>
      </div>
    )
  }
}

CreateInstanceForm.propTypes = {
  course_id: PropTypes.number.isRequired,
  addInstance: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addInstance: asyncAction(addInstance, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(CreateInstanceForm))
