import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addHeader } from '../../actions/types'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
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

  translate = id => this.props.translate(`Course.types.CreateHeaderForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    const label = {
      name: this.translate('name')
    }
    return (
      <div className="CreateHeaderForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic onClick={this.expand} className="addHeaderButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <p>
                {contentPrompt}.
              </p>
              <MultilingualField field="name" fieldDisplay={label.name} />
            </div>
          }
          actions={saveActions(this.translate)}
          onSubmit={this.addHeaderSubmit}
        />
      </div>
    )
  }
}

CreateHeaderForm.propTypes = {
  addHeader: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addHeader: asyncAction(addHeader, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(CreateHeaderForm))
