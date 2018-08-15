import React, { Component } from 'react'
import { shape, func } from 'prop-types'
import { Button, Grid, Input, List, Table, Dropdown, Accordion } from 'semantic-ui-react'
import Papa from 'papaparse'

export class UploadResponsesPage extends Component {
  state = {
    csv: undefined,
    csvMappings: {},
    studentHeader: undefined,
    pointsMapping: {},
    pointKey: '',
    pointValue: 0
  }

  loadFile = async (e) => {
    const { files } = e.target
    Papa.parse(files[0], {
      complete: results => this.setState({ csv: results }, () => this.mapCsvToTasks())
    })
  }

  mapCsvToTasks = () => {
    const { csv } = this.state
    const { activeCourse } = this.props
    const headers = csv.data[0]
    const suggestions = {}
    headers.map((header, i) => {
      const suggestion = activeCourse.tasks.find(task => task.name.includes(headers[i]))
      suggestions[i] = {
        task: suggestion || { name: 'ei ehdotusta' },
        active: suggestion,
        csv: header
      }
    })
    const studentHeader = headers.findIndex(header => header.includes('Opiskelijanumero'))
    this.setState({ csvMappings: suggestions, studentHeader })
  }

  handleMapTask = (e, { value, suggestion }) => {
    const mappings = { ...this.state.csvMappings }
    const task = this.props.activeCourse.tasks.find(t => t.id === value)
    mappings[suggestion].task = task
    this.setState({ csvMappings: mappings })
  }

  toggleCsvHeader = (e, { value }) => {
    const mappings = { ...this.state.csvMappings }
    mappings[value].active = !mappings[value].active
    this.setState({ csvMappings: mappings })
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  addPointMapping = () => {
    const { pointsMapping, pointKey, pointValue } = this.state
    this.setState({ pointsMapping: { ...pointsMapping, [pointKey]: Number(pointValue) } })
  }

  removePointMapping = (e, { value }) => {
    const mappings = { ...this.state.pointsMapping }
    delete mappings[value]
    this.setState({ pointsMapping: mappings })
  }

  createResponseData = () => {
    const { csv, csvMappings, studentHeader, pointsMapping } = this.state
    const { activeCourse } = this.props
    const students = csv.data
    const tasks = Object.keys(csvMappings).filter(task => csvMappings[task].active)
    const updatedTasks = []
    for (let i = 1; i < students.length; i += 1) {
      const row = students[i]
      const student = activeCourse.people.find(person =>
        person.studentnumber.includes(String(row[studentHeader])))
      if (student) {
        const studentTasks = tasks.map((task) => {
          const response = { personId: student.id, taskId: csvMappings[task].task.id }
          if (pointsMapping[row[task]] !== undefined) {
            response.points = Number(pointsMapping[row[task]])
          } else {
            const points = Number(row[task].replace(',', '.'))
            if (Number.isNaN(points)) {
              response.points = 0
            } else {
              response.points = points
            }
          }
          const existingResponse = student.task_responses.find(resp =>
            resp.task_id === response.taskId && resp.person_id === response.personId)
          if (existingResponse) {
            response.responseId = existingResponse.id
          }
          if (response.taskId && response.personId && response.points) {
            return response
          }
        })
        updatedTasks.push(...studentTasks.filter(task => task !== undefined))
      }
    }
    this.props.updateHandler(updatedTasks)
  }

  renderCsvTable = csv => (
    <Grid.Row>
      <Grid.Column style={{ overflowX: 'scroll' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              {csv.data[0].map((cell, i) => <Table.HeaderCell key={`${cell},${i}`}>{cell}</Table.HeaderCell>)}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {csv.data.map((row, i) => (i === 0 ? undefined :
            <Table.Row key={i}>
              {row.map((cell, j) => <Table.Cell key={j}>{cell}</Table.Cell>)}
            </Table.Row>))}
          </Table.Body>
        </Table>
      </Grid.Column>
    </Grid.Row>
  )

  render() {
    const { csv, csvMappings, studentHeader, pointsMapping, pointKey, pointValue } = this.state
    const { activeCourse } = this.props
    return !activeCourse.id ? <h1>Loading</h1> : (
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <h3>Valitse ladattava csv-tiedosto</h3>
            <Input type="file" accept=".csv" onChange={this.loadFile} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {csv ? (
              <div>
                <h4>Opiskelijanumerot sarakkeessa: </h4>
                <Dropdown
                  name="studentHeader"
                  value={studentHeader}
                  scrolling
                  placeholder="Valitse opiskelijanumeroiden sarake"
                  options={Object.keys(csvMappings).map(key =>
                    ({ key, text: csvMappings[key].csv, value: Number(key) }))}
                  onChange={this.handleChange}
                />
              </div>) : undefined}
            <List size="small">
              {Object.keys(csvMappings).map(suggestion => (
                <List.Item key={suggestion}>
                  <List.Content style={{ padding: 0 }}>
                    {csvMappings[suggestion].active ?
                      <b>{csv.data[0][suggestion]} </b> :
                      <strike>{csv.data[0][suggestion]} </strike>}
                      ______________
                    <Dropdown
                      disabled={!csvMappings[suggestion].active}
                      search
                      selectOnBlur={false}
                      scrolling
                      suggestion={suggestion}
                      value={csvMappings[suggestion].task.id ?
                        csvMappings[suggestion].task.id : null}
                      placeholder="Valitse vastaava tehtävä"
                      options={activeCourse.tasks.map(task =>
                        ({ key: task.id, text: task.name, value: task.id }))}
                      onChange={this.handleMapTask}
                    />
                    <Button
                      basic
                      circular
                      color={csvMappings[suggestion].active ? 'green' : 'red'}
                      icon={csvMappings[suggestion].active ? 'checkmark' : 'minus'}
                      size="mini"
                      value={suggestion}
                      onClick={this.toggleCsvHeader}
                    />
                  </List.Content>
                </List.Item>))}
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {csv ?
            <Grid.Column>
              <h3>Onko sarakkeissa arvoja, joiden pistemäärä pitää muuttaa numeraalisiksi?</h3>
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
                      onClick={this.removePointMapping}
                    />
                  </List.Item>
                ))}
              </List>
              <Input name="pointKey" label="arvo" type="text" value={pointKey} onChange={this.handleChange} />
              <Input name="pointValue" label="pistemäärä" type="number" value={pointValue} onChange={this.handleChange} />
              <Button onClick={this.addPointMapping}>Lisää</Button>
            </Grid.Column> : undefined}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h3>Luo palautukset</h3>
            <Button onClick={this.createResponseData}>Luo palautukset</Button>
          </Grid.Column>
        </Grid.Row>
        {csv ?
          <Accordion
            defaultActiveIndex={-1}
            panels={[{
              key: 'table',
              title: 'Katso csv-tiedoston sisältöä',
              content: { key: 'subtable', content: this.renderCsvTable(csv) } }]}
          />
        : undefined}
      </Grid>
    )
  }
}

UploadResponsesPage.propTypes = {
  activeCourse: shape().isRequired,
  updateHandler: func.isRequired
}

export default UploadResponsesPage
