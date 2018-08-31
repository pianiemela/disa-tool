import { Form, Card, List, Grid, Segment, Message } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { gradeObjectiveAction } from '../../../actions/selfAssesment'

import MathJaxText from '../../../../../utils/components/MathJaxText'
import { objectiveGrades } from '../../../utils'
import '../../../Userform/selfAssesment.css'


class ObjectiveQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ratings: {} }
  }

  componentDidMount() {
    const ratings = {}
    this.props.data.objectives.forEach((value) => {
      ratings[value.id] = -1
    })
    this.setState({ ratings })
  }

  handleChange = (objective, value) => {
    const { ratings } = { ...this.state }
    ratings[objective] = value
    this.props.dispatchGradeObjectiveAction({ id: objective, value, final: false })
    this.setState({ ratings })
  }

  render() {
    const { objectives, name, id } = this.props.data
    const { gradeError, clearError } = this.props
    const { ratings } = this.state

    return (
      <Card fluid>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Column>
              <h3>{name}</h3>
            </Grid.Column>
            <Grid.Column>
              <div style={{ display: 'flex' }}>
                {Object.keys(objectiveGrades).map(o =>
                  (
                    <div key={o} style={{ flexGrow: 1 }}>
                      {objectiveGrades[o]}
                    </div>))}
              </div>
            </Grid.Column>
          </Grid>
          <Form error={gradeError !== undefined}>
            <List divided>
              {objectives.map(o =>
                (o.includedInAssesment ?
                  <List.Item key={o.id}>
                    <List.Content>
                      <Grid verticalAlign="middle" columns="equal">
                        <Grid.Row style={{ padding: '20px' }}>
                          <Grid.Column>
                            <Segment>
                              <MathJaxText content={o.name} />
                            </Segment>
                          </Grid.Column >
                          <Grid.Column>
                            <div style={{ display: 'flex' }}>
                              {Object.keys(objectiveGrades).map(og =>
                                (
                                  <div key={og} style={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Form.Checkbox
                                      error={gradeError.errors[o.id] !== undefined} //eslint-disable-line
                                      objective={o.id}
                                      value={og}
                                      checked={ratings[o.id] === og}
                                      onChange={(e, { objective, value }) => {
                                        this.handleChange(objective, value); clearError({ type: 'qModErrors', errorType: 'grade', id, objective })
                                      }}
                                      radio
                                    />
                                  </div>))}
                            </div>
                            <Message
                              error
                              style={{ textAlign: 'center' }}
                              content={gradeError.errors[o.id] ? gradeError.errors[o.id].error : null}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </List.Content>
                  </List.Item>
                  :
                  null))}
            </List>
          </Form>
        </Card.Content>
      </Card >
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchGradeObjectiveAction: data =>
    dispatch(gradeObjectiveAction(data))
})

ObjectiveQuestionModule.defaultProps = {
  data: {
    options: [],
    name: 'Nothing',
    objectives: [],
    id: null
  },
  gradeError: { errors: {} }
}
ObjectiveQuestionModule.propTypes = {
  data: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })),
    id: PropTypes.number
  }),
  dispatchGradeObjectiveAction: PropTypes.func.isRequired,
  gradeError: PropTypes.shape({
    errors: PropTypes.shape()
  }),
  clearError: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(ObjectiveQuestionModule)
