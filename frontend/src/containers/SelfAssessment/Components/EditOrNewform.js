import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Form } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import AssessmentButtons from './AssessmentButtons'
import SelfAssessmentList from './SelfAssessmentList'


export class EditOrNewForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropDownValue: null
    }
  }

  componentDidMount() {
    this.setState({ dropDownValue: parseInt(this.props.selectedCourse, 10) })
  }

  handleDropdownChange = (e, { value }) => {
    this.setState({ dropDownValue: value })
  }

  translate = id => this.props.translate(`SelfAssessment.EditOrNewForm.${id}`)

  render() {
    const { selectedView } = this.state
    const { dropDownCourse, selectedCourse, handleSubmit, selfAssessments } = this.props
    const selectedSelfAssessments = selfAssessments.filter(s =>
      s.course_instance_id === parseInt(this.state.dropDownValue, 10))

    return (
      <div>
        <Form>
          <Form.Field style={{ marginTop: '20px' }}>
            <Dropdown
              selection
              placeholder={this.translate('placeholder')}
              onChange={this.handleDropdownChange}
              options={dropDownCourse}
              defaultValue={parseInt(selectedCourse, 10)}
            />
          </Form.Field>
          <Form.Field>
            {selectedSelfAssessments.length > 0 &&
              <SelfAssessmentList
                onClick={handleSubmit}
                selfAssessments={selectedSelfAssessments}
              />
            }
          </Form.Field>
          <Form.Field>
            <AssessmentButtons
              selectedView={selectedView}
              onClick={handleSubmit}
              value={this.state.dropDownValue}
            />
          </Form.Field>
        </Form>
      </div>

    )
  }
}

EditOrNewForm.propTypes = {
  dropDownCourse: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selfAssessments: PropTypes.arrayOf(PropTypes.shape()),
  selectedCourse: PropTypes.string,
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

EditOrNewForm.defaultProps = {
  selfAssessments: [],
  selectedCourse: null
}
export default withLocalize(EditOrNewForm)
