import { Form, Card, Grid } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'

const CategoryQuestionModule = (props) => {
  const { name } = props.data
  return (
    <Form.Field>
      <Card fluid>
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Grid verticalAlign="middle" columns={2}>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column>
                <label> Arvioi osaamisesi asteikolla 1-5</label>
              </Grid.Column>
              <Grid.Column>
                <input style={{}} type="range" min={1} max={5} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column width={10}>
                <Form.TextArea
                  label="Perustelut arvosanalle"
                  placeholder="Kirjoita perustelut valitsemallesi arvosanalle"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </Form.Field>
  )
}

CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }).isRequired
}

export default CategoryQuestionModule
