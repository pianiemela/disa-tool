import React, { Component } from 'react'
import { func, shape, arrayOf, string } from 'prop-types'
import { Accordion, Grid, Icon, Table } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

class CsvTable extends Component {
  state = {
    activeIndex: -1
  }

  t = id => this.props.translate(`UserPage.UploadResponses.CsvTable.${id}`)

  handleAccordion = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    const { csv } = this.props
    return (
      <Accordion styled>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordion}>
          <Icon name="dropdown" />
          {this.t('look_at_csv')}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid.Row>
            <Grid.Column style={{ overflowX: 'auto' }}>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {csv.data[0].map((cell, i) =>
                      // Using indexes should be fine here, since the table is read-only
                      // eslint-disable-next-line
                      <Table.HeaderCell key={`${cell},${i}`}>{cell}</Table.HeaderCell>)}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {csv.data.map((row, i) => (i === 0 ? undefined : (
                    // eslint-disable-next-line
                    <Table.Row key={i}>
                      {/* eslint-disable-next-line */}
                      {row.map((cell, j) => <Table.Cell key={j}>{cell}</Table.Cell>)}
                    </Table.Row>
                  )))}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Accordion.Content>
      </Accordion>
    )
  }
}

CsvTable.propTypes = {
  csv: shape({
    data: arrayOf(arrayOf(string))
  }).isRequired,
  translate: func.isRequired
}

export default withLocalize(CsvTable)
