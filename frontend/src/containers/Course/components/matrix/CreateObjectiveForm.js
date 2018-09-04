import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addObjective, moveObjective } from '../../actions/objectives'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateObjectiveForm extends Component {
    addObjectiveSubmit = (e) => {
      this.props.addObjective({
        eng_name: e.target.eng_name.value,
        fin_name: e.target.fin_name.value,
        swe_name: e.target.swe_name.value,
        skill_level_id: this.props.level.id,
        category_id: this.props.category.id,
        course_instance_id: this.props.courseId
      })
    }

    paste = () => {
      this.props.moveObjective({
        id: this.props.cut,
        category_id: this.props.category.id,
        skill_level_id: this.props.level.id
      })
    }

    translate = id => this.props.translate(`Course.matrix.CreateObjectiveForm.${id}`)

    render() {
      if (this.props.cut) {
        return (
          <div className="CreateObjectiveForm">
            <Button basic className="addObjectiveButton" icon={{ name: 'paste' }} onClick={this.paste} />
          </div>
        )
      }
      const contentPrompt = [
        this.translate('prompt_1'),
        `"${this.props.category.name}"`,
        this.translate('prompt_2'),
        `"${this.props.level.name}"`
      ].join(' ')
      return (
        <div className="CreateObjectiveForm">
          <ModalForm
            header={this.translate('header')}
            trigger={<Button basic className="addObjectiveButton" icon={{ name: 'add' }} />}
            actions={saveActions(this.translate)}
            onSubmit={this.addObjectiveSubmit}
          >
            <p>{contentPrompt}.</p>
            <MultilingualField field="name" fieldDisplay={this.translate('name')} />
          </ModalForm>
        </div>
      )
    }
}

CreateObjectiveForm.propTypes = {
  addObjective: PropTypes.func.isRequired,
  level: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  courseId: PropTypes.number.isRequired,
  cut: PropTypes.number,
  moveObjective: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

CreateObjectiveForm.defaultProps = {
  cut: null
}

const mapStateToProps = (state, ownProps) => ({
  category: ownProps.category,
  level: state.level.levels.find(level => level.id === ownProps.levelId),
  cut: state.objective.cut
})

const mapDispatchToProps = dispatch => ({
  addObjective: asyncAction(addObjective, dispatch),
  moveObjective: asyncAction(moveObjective, dispatch)
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(CreateObjectiveForm))
