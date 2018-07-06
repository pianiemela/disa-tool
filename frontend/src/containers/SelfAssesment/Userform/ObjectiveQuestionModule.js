import { Form, Card, List, Grid } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'

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
    this.setState({ ratings })
  }

  handleChange = (e, data) => {
    const { ratings } = this.state
    ratings[data] = e.target.value
    this.setState({ ratings })
  }

  render() {
    const { ratings } = this.state
    const { objectives, answers, name } = this.props.data
    console.log(this.props)
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
                      <List.Item as="li">{o.name}
                      </List.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <input style={{}} value={ratings[o.name] ? ratings[o.name] : 1} onChange={(e) => this.handleChange(e, o.name)} type="range" min={0} max={2} />
                    </Grid.Column>
                    <Grid.Column>
                      {answers[ratings[o.name]]}
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
ObjectiveQuestionModule.defaultProps = {
  data: {
    answers: [],
    name: 'Nothing'
  }
}
ObjectiveQuestionModule.propTypes = {
  data: PropTypes.shape({
    answers: PropTypes.arrayOf(),
    name: PropTypes.string
  })
}

export default ObjectiveQuestionModule
