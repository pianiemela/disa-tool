import { Form, Card, List, Rating, Grid } from 'semantic-ui-react'
import React from 'react'


class ObjectiveQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ratings: {} }
  }

  componentDidMount() {
    const ratings = {}
    this.props.data.objectives.forEach((value) => {
      ratings[value.fin_name] = 1
    })
    this.setState({ ratings })
  }

  handleChange = (e, data) => {
    let ratings = this.state.ratings
    ratings[data] = e.target.value
    this.setState({ ratings })

  }

  render() {
    const { ratings } = this.state
    const { objectives, answers, fin_name } = this.props.data
    return (
      <Form.Field>
        <Card fluid>
          <Card.Content>
            <Card.Header>{fin_name}</Card.Header>
            <List>
              {objectives.map(o => (
                <Grid verticalAlign="middle" columns={3}>
                  <Grid.Row style={{ padding: '20px' }}>
                    <Grid.Column>
                      <List.Item as="li">{o.fin_name}
                      </List.Item>
                    </Grid.Column>
                    <Grid.Column>
                      <input style={{}} value={ratings[o.fin_name] ? ratings[o.fin_name] : 1} onChange={(e) => this.handleChange(e, o.fin_name)} type='range' min={0} max={2} />
                    </Grid.Column>
                    <Grid.Column>
                      {answers[ratings[o.fin_name]]}
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

export default ObjectiveQuestionModule
