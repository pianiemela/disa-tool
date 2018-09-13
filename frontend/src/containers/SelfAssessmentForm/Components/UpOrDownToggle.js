import React from 'react'
import { connect } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { toggleUp, toggleDown } from '../actions/selfAssesment'

const UpOrDownToggle = (props) => {
  const { id } = props
  const translate = translateId => props.translate(`SelfAssessment.Userform.FormParts.UpOrDownToggle.${translateId}`)

  return (
    <div>
      <Popup
        trigger={
          <Icon
            color="red"
            name="arrow circle down"
            size="big"
            onClick={() => props.dispatchDown(id)}
          />}
        content={translate('downButton')}
      />
      <Popup
        trigger={
          <Icon
            color="green"
            name="arrow circle up"
            size="big"
            onClick={() => props.dispatchUp(id)}
          />}
        content={translate('upButton')}
      />
    </div>
  )
}

UpOrDownToggle.propTypes = {
  id: PropTypes.number.isRequired,
  dispatchDown: PropTypes.func.isRequired,
  dispatchUp: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchUp: id =>
    dispatch(toggleUp(id)),
  dispatchDown: id =>
    dispatch(toggleDown(id))
})

export default withLocalize(connect(null, mapDispatchToProps)(UpOrDownToggle))
