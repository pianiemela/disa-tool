import { Card, Grid, Checkbox, Button, List, Accordion, Icon } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UpOrDownToggle from '../UpOrDownToggle'
import { gradeCategoryAction, textfieldResponseAction, toggleTextField, toggleFormPartAction, changeHeaderAction } from '../../../actions/selfAssesment'
import MathJaxText from '../../../../../utils/components/MathJaxText'


export class EditObjectiveModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
  }

  handleClick = () => this.setState({ active: !this.state.active })

  render() {
    const { objectives, options, name, id, includedInAssesment } = this.props.data

    return (
      <Accordion style={{ marginTop: '20px', marginBottom: '20px' }} fluid styled>
        <Accordion.Title active={this.state.active}>
          <Grid divided='vertically' verticalAlign="middle" columns={2}>
            <Grid.Row>
              <Grid.Column style={{ padding: 'auto' }} onClick={this.handleClick}>
                <span onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  {name}
                </span>
              </Grid.Column>
              <Grid.Column>
                <span>
                  <Button
                    className="toggleFormPartButton"
                    size="small"
                    basic
                    color={includedInAssesment ? 'green' : 'red'}
                    onClick={() => this.props.dispatchToggleFormPartAction(id, 'category')}
                  >{includedInAssesment ? 'Mukana itsearviossa' : 'Ei mukana itsearviossa'}
                  </Button>
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </Accordion.Title>

        <Accordion.Content active={this.state.active}>
          {/* <List celled>
            {objectives.map(o => (
              <List.Item key={o.id} >
                <List.Content>
                      a
                  <MathJaxText content={o.name} />
                </List.Content>
                <List.Content floated="right">
                  <Button
                    className="toggleFormPartButton"
                    size="small"
                    basic
                    disabled={!includedInAssesment}
                    color={includedInAssesment ? o.includedInAssesment ? 'green' : 'red' : 'red'}
                    onClick={() => this.props.dispatchToggleFormPartAction(o.id, 'objective')}
                  >{includedInAssesment ? o.includedInAssesment ? 'Mukana itsearviossa' : 'Ei mukana itsearviossa' : 'Ei mukana itsearviossa'}
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List> */}
          <List divided verticalAlign='middle'>
            {objectives.map(o => (
              <List.Item key={o.id} >
                <List.Content floated="right">
                  <Button
                    style={{ padding: '10px', margin: '0' }}
                    className="toggleFormPartButton"
                    size="tiny"
                    basic
                    disabled={!includedInAssesment}
                    color={includedInAssesment ? o.includedInAssesment ? 'green' : 'red' : 'red'}
                    onClick={() => this.props.dispatchToggleFormPartAction(o.id, 'objective')}
                  >{includedInAssesment ? o.includedInAssesment ? 'Mukana itsearviossa' : 'Ei mukana itsearviossa' : 'Ei mukana itsearviossa'}
                  </Button>
                </List.Content>
                <List.Content style={{ margin: '0' }}>
                  <MathJaxText content={o.name} />
                </List.Content>

              </List.Item>
            ))}
          </List>

        </Accordion.Content>
      </Accordion>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchToggleFormPartAction: (id, type) =>
    dispatch(toggleFormPartAction(id, type))
})


export default connect(null, mapDispatchToProps)(EditObjectiveModule)
