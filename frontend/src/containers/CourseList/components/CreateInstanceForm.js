import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Icon, Dropdown, Form, Label } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { addInstance } from '../actions/courseInstances'

import ModalForm from '../../../utils/components/ModalForm'
import MultilingualField from '../../../utils/components/MultilingualField'

export class CreateInstanceForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      instance_to_copy: 0
    }
  }

  addInstanceSubmit = (e) => {
    this.props.addInstance({
      course_id: this.props.course_id,
      course_instance_id: this.state.instance_to_copy === 0 ? undefined : this.state.instance_to_copy,
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
          <Form.Field>
            <Label>{this.translate('dropdown_label')}</Label>
            <Dropdown
              selection
              name="instance_to_copy"
              value={this.state.instance_to_copy}
              onChange={(e, { value }) => this.setState({ instance_to_copy: value })}
              options={
                [...this.props.instances, ...this.props.templateInstances].map(instance => ({
                  key: instance.id,
                  value: instance.id,
                  text: instance.name
                })).concat([{
                  key: 0,
                  value: 0,
                  text: this.translate('dropdown_null_value')
                }])
              }
            />
          </Form.Field>
          <Button type="submit" color="green">{this.translate('save')}</Button>
        </ModalForm>
      </div>
    )
  }
}

CreateInstanceForm.propTypes = {
  course_id: PropTypes.number.isRequired,
  addInstance: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  instances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
}

const mapStateToProps = state => ({
  instances: state.listCourses.instances,
  templateInstances: state.listCourses.templateInstances
})

const mapDispatchToProps = dispatch => ({
  addInstance: asyncAction(addInstance, dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(CreateInstanceForm))
