import { Form, Card, Grid, Checkbox, Dropdown } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'

const CategoryQuestionModule = (props) => {
  const { name, edit } = props.data
  console.log(props)

  const gradeOptions = [
    {
      text: '1',
      value: 1
    },
    {
      text: '2',
      value: 2
    },
    {
      text: '3',
      value: 3
    },
    {
      text: '4',
      value: 4
    },
    {
      text: '5',
      value: 5
    },

  ]

  const textArea = () => {
    if (props.edit) {
      return (
        <Grid.Column width={10}>
          <Form.TextArea
            label="Perustelut arvosanalle"
            placeholder="Kirjoita perustelut valitsemallesi arvosanalle"
          />
          <Checkbox label="Klikkaa tästä jos haluat persustelut mukaan" />
        </Grid.Column>
      )
    } return (
      <Grid.Column width={10}>
        <Form.TextArea
          label="Perustelut arvosanalle"
          placeholder="Kirjoita perustelut valitsemallesi arvosanalle"
        />
      </Grid.Column>

    )
  }

  return (
    <Form.Field>
      <Card fluid>
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Grid verticalAlign="middle" columns={2}>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column>
                <label> Arvioi osaamisesi asteikolla 1-5</label>
                <Dropdown style={{ marginLeft: '20px' }} placeholder='Valitse arvosana' selection options={gradeOptions} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column width={10}>
                {textArea()}
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
