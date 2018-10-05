import React, { Component } from 'react'
import { Button, Input, List } from 'semantic-ui-react'
import { func, shape } from 'prop-types'
import { withLocalize } from 'react-localize-redux'

class PointMapping extends Component {
  state = {
    pointKey: '',
    pointValue: 0
  }

  t = id => this.props.translate(`UserPage.UploadResponses.PointMapping.${id}`)

  handleChange = (e, { value }) => {
    this.setState({ [e.target.name]: value })
  }

  handleAdd = () => {
    this.props.addPointMapping(this.state.pointKey, this.state.pointValue)
  }

  render() {
    const { pointsMapping } = this.props
    const { pointKey, pointValue } = this.state
    return (
      <div>
        <h3>{this.t('point_mapping_text')}</h3>
        <List>
          {Object.keys(pointsMapping).map(key => (
            <List.Item key={key}>
              {key} = {pointsMapping[key]}
              <Button
                basic
                color="red"
                icon="delete"
                size="tiny"
                value={key}
                onClick={this.props.removePointMapping}
              />
            </List.Item>
                ))}
        </List>
        <Input
          name="pointKey"
          label={this.t('key')}
          type="text"
          value={pointKey}
          onChange={this.handleChange}
        />
        <Input
          name="pointValue"
          label={this.t('value')}
          type="number"
          value={pointValue}
          onChange={this.handleChange}
        />
        <Button onClick={this.handleAdd}>{this.t('add')}</Button>
      </div>
    )
  }
}

PointMapping.propTypes = {
  pointsMapping: shape().isRequired,
  addPointMapping: func.isRequired,
  removePointMapping: func.isRequired,
  translate: func.isRequired
}

export default withLocalize(PointMapping)
