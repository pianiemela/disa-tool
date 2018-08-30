import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addCategory } from '../../actions/categories'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateCategoryForm extends Component {
  addCategorySubmit = (e) => {
    this.props.addCategory({
      course_instance_id: this.props.courseId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
  }

  translate = id => this.props.translate(`Course.matrix.CreateCategoryForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    return (
      <Table.Row className="CreateCategoryForm">
        <Table.Cell>
          <ModalForm
            header={this.translate('header')}
            trigger={<Button basic className="addCategoryButton" icon={{ name: 'add' }} />}
            content={
              <div>
                <p>
                  {contentPrompt}.
                </p>
                <MultilingualField field="name" fieldDisplay={this.translate('name')} />
              </div>
            }
            actions={saveActions(this.translate)}
            onSubmit={this.addCategorySubmit}
          />
        </Table.Cell>
      </Table.Row>
    )
  }
}

CreateCategoryForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addCategory: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addCategory: asyncAction(addCategory, dispatch)
})

export default connect(null, mapDispatchToProps)(withLocalize(CreateCategoryForm))
