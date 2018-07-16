import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Button, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { addOpenQuestion } from '../../../../actions/actions'

class AddOpenQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: ''
    }
  }

  textField = (e) => {
    this.setState({ questionData: e.target.value })
  }

  clear = () => {
    this.setState({ questionData: '' })
  }

  render() {
    return (
      <Grid verticalAlign="middle" columns={2}>
        <Grid.Row>
          <Grid.Column stretched>
            <Input
              size="medium"
              placeholder="Lisää avoin kysymys"
              onChange={this.textField}
              value={this.state.questionData}
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              onClick={() => {
                this.props.dispatchAddOpenQuestion(this.state.questionData); this.clear()
              }}
              type="submit"
              circular
              name="plus"
              size="large"
              color="green"
            >Lisää
            </Button>
          </Grid.Column>
        </Grid.Row >
      </Grid >

    )
  }
}
const mapDispatchToProps = dispatch => ({
  dispatchAddOpenQuestion: questionData =>
    dispatch(addOpenQuestion(questionData))
})

AddOpenQuestion.propTypes = {
  dispatchAddOpenQuestion: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AddOpenQuestion)
