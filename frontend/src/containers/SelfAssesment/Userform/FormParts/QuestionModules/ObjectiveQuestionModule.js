import { Form, Card, List, Grid } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { gradeObjectiveAction } from '../../../actions/selfAssesment'

import MathJaxText from '../../../../../utils/components/MathJaxText'

class ObjectiveQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ratings: {} }
  }

  componentDidMount() {
    const ratings = {}
    this.props.data.objectives.forEach((value) => {
      ratings[value.name] = 1
    })
    // this.setState({ ratings })
  }

  handleChange = (e, name, id) => {
    const { ratings } = this.state
    ratings[name] = e.target.value
    this.setState({ ratings })
    this.props.dispatchGradeObjectiveAction({ value: e.target.value, id })
  }

  render() {
    const { ratings } = this.state
    const { objectives, options, name } = this.props.data
    return (
      <Form.Field>
        <Card fluid>
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <List>
              {objectives.map(o => (
                <Grid key={o.id} verticalAlign="middle" columns={3}>
                  <Grid.Row style={{ padding: '20px' }}>
                    <Grid.Column>
                      <List.Item as="li"><MathJaxText content={o.name} /></List.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <input
                        style={{}}
                        value={ratings[o.name] ? ratings[o.name] : 1}
                        onChange={e => this.handleChange(e, o.name, o.id)}
                        type="range"
                        min={0}
                        max={2}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      {options[ratings[o.name]]}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ))}
            </List>
          </Card.Content>
        </Card>
      </Form.Field >
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
    objectives: []
  }
}
ObjectiveQuestionModule.propTypes = {
  data: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    objectives: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }))
  }),
  dispatchGradeObjectiveAction: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(ObjectiveQuestionModule)
