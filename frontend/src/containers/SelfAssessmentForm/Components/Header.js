import React from 'react'
import { withLocalize } from 'react-localize-redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import MultiLangInput from './MultiLangInput'
import { changeHeaderAction } from '../actions/selfAssesment'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editHeaders: false,
      changedHeaders: {}
    }
  }

  toggleEdit = () => {
    const { changedHeaders } = this.state
    const { headerType } = this.props
    this.props.dispatchChange ?  //eslint-disable-line
      this.props.dispatchChange(changedHeaders) :
      this.props.dispatchHeaderChange({
        changedHeaders,
        headerType
      })
    this.setState({ editHeaders: !this.state.editHeaders })
  }

  changeHeader = (id, value) => {
    const oldState = this.state.changedHeaders
    oldState[id] = value
    this.setState({ editHeaders: oldState })
  }

  render() {
    const translate = id => this.props.translate(`SelfAssessmentForm.Header.${id}`)
    const { name, edit, headers, style, editButton } = this.props
    const { editHeaders } = this.state

    const header = editButton ?
      (
        <div>
          {name}
          {edit &&
            <Button
              className="editHeadersButton"
              onClick={this.toggleEdit}
              style={{ marginLeft: '10px' }}
            >
              {editHeaders ? translate('buttonShow') : translate('buttonEdit')}
            </Button>
          }
        </div>)
      :
      name


    const headerEditForm = editHeaders &&
      (
        <div style={{
          marginBottom: '10px'
        }}
        >
          <Form>
            <MultiLangInput
              headers={headers}
              handleChange={this.changeHeader}
            />
          </Form>
        </div>
      )

    return (
      <div>
        <h3 style={this.props.style ? style : null} className="cardHead" >
          {header}
        </h3>
        {headerEditForm}
      </div>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  dispatchHeaderChange: data =>
    dispatch(changeHeaderAction(data))
})

Header.defaultProps = {
  dispatchChange: null,
  headerType: null,
  style: null,
  editButton: false
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  headerType: PropTypes.string,
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  style: PropTypes.shape(),
  dispatchHeaderChange: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  dispatchChange: PropTypes.func,
  editButton: PropTypes.bool
}

export default withLocalize(connect(null, mapDispatchToProps)(Header))

