import { Form, Card, Grid, Checkbox, Dropdown } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UpOrDownToggle from '../upDownToggle'
import { toggleTextField } from '../../../../../actions/actions'


const CategoryQuestionModule = (props) => {
  const { edit, final, textArea } = props
  const { name, textFieldOn, id } = props.data

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
    }
  ]
  const checkbox = edit ? (<Checkbox
    defaultChecked={textFieldOn}
    onChange={() => props.dispatchTextFieldOnOff(id)}
    label="Klikkaa tästä jos haluat perustelut mukaan"
  />) : null


  return (
    <Form.Field>
      <Card fluid>
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Grid verticalAlign="middle" columns={3}>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column width={10}>
                <label> Arvioi osaamisesi asteikolla 1-5</label>
                <Dropdown style={{ marginLeft: '20px' }} placeholder="Valitse arvosana" selection options={gradeOptions} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: '20px' }}>
              <Grid.Column width={10}>
                {textArea('Perustelut arvosanalle', 'Kirjoita perustelut valitsemallesi arvosanalle', textFieldOn, final ? null : checkbox)}
              </Grid.Column>
              {final ?
                null
                :
                <Grid.Column>
                  <UpOrDownToggle id={id} />
                </Grid.Column>
              }
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </Form.Field>
  )
}

CategoryQuestionModule.defaultProps = {
  final: false
}


CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  final: PropTypes.bool,
  textArea: PropTypes.func.isRequired,
  dispatchTextFieldOnOff: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldOnOff: id =>
    dispatch(toggleTextField(id))
})

export default connect(null, mapDispatchToProps)(CategoryQuestionModule)