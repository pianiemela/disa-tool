import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addObjective } from '../../services/objectives'

import ModalForm from '../../../../utils/components/ModalForm'
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

    render() {
      const contentPrompt = [
        'Lisää uusi oppimistavoite kategoriaan',
        `"${this.props.category.name}"`,
        'tasolle',
        `"${this.props.level.name}"`
      ].join(' ')
      return (
        <div className="CreateObjectiveForm">
          <ModalForm
            header="Luo uusi oppimistavoite"
            trigger={<Button className="addObjectiveButton" icon={{ name: 'add' }} />}
            content={
              <div>
                <p>
                  {contentPrompt}.
                </p>
                <MultilingualField field="name" fieldDisplay="nimi" />
                <Button type="submit" color="green">Tallenna</Button>
              </div>
            }
            onSubmit={this.addObjectiveSubmit}
          />
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
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  category: ownProps.category,
  level: state.level.levels.find(level => level.id === ownProps.levelId)
})

const mapDispatchToProps = dispatch => (
  {
    addObjective: asyncAction(addObjective, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(CreateObjectiveForm)
