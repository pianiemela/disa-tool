import React from 'react'
import { func } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import { selectAll, deselectAll } from '../actions/selfAssesmentList'

const SelectionButtons = (props) => {
  const translate = id => props.translate(`SelfAssessmentList.SelectionButtons.${id}`)
  return (
    <div>
      <Button content={translate('select')} onClick={props.select} />
      <Button content={translate('deselect')} onClick={props.deselect} />
    </div>
  )
}

SelectionButtons.propTypes = {
  select: func.isRequired,
  deselect: func.isRequired,
  translate: func.isRequired
}

const mapDispatchToProps = dispatch => ({
  select: selectAll(dispatch),
  deselect: deselectAll(dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(SelectionButtons))
