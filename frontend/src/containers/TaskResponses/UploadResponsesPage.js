import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Input, List, Table, Dropdown, Accordion } from 'semantic-ui-react'
import Papa from 'papaparse'

import { getCourseInstanceDataAction } from '../../actions/actions'

export class UploadResponsesPage extends Component {
  state = {
    csv: undefined,
    csvMappings: {},
    studentHeader: undefined,
    pointsMapping: {},
    pointKey: '',
    pointValue: 0
  }

  // componentDidMount() {
  //   const { courseId } = this.props.match.params
  //   if (courseId) {
  //     this.setState({ courseId })
  //   }
  //   if (!this.props.activeCourse.id) {
  //     this.props.dispatchGetCourseInstanceData(courseId)
  //   }
  // }

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
      suggestions[i] = {
        task: activeCourse.tasks.find(task => task.name.includes(headers[i])) ? activeCourse.tasks.find(task => task.name.includes(headers[i])) : { name: 'ei ehdotusta' },
        active: true,
        csv: header
      }
    })
    const studentHeader = headers.findIndex(header => header.includes('Opiskelijanumero'))
    console.log(suggestions)
    this.setState({ csvMappings: suggestions, studentHeader })
  }

  handleMapTask = suggestion => (e, { value }) => {
    const mappings = { ...this.state.csvMappings }
    const task = this.props.activeCourse.tasks.find(t => t.id === value)
    mappings[suggestion].task = task
    this.setState({ csvMappings: mappings })
  }

  removeCsvHeader = (e, { value }) => {
    const mappings = { ...this.state.csvMappings }
    mappings[value].active = false
    this.setState({ csvMappings: mappings })
  }

  handlePointChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  addPointMapping = () => {
    const { pointsMapping, pointKey, pointValue } = this.state
    this.setState({ pointsMapping: { ...pointsMapping, [pointKey]: pointValue } })
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
            response.points = pointsMapping[row[task]]
          } else {
            const points = Number(row[task].replace(',', '.'))
            if (Number.isNaN(points)) {
              response.points = 0
            } else {
              response.points = points
            }
          }
          return response
        })
        updatedTasks.push(...studentTasks)
      }
    }
    this.props.updateHandler(updatedTasks)
  }

  accordionPanels = csv => (
    [{ key: 'table', title: '', content: { content: this.renderCsvTable(csv) } }]
  )

  renderCsvTable = csv => (
    <Grid.Row>
      <Grid.Column style={{ overflowX: 'scroll' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              {csv.data[0].map(cell => <Table.HeaderCell key={cell}>{cell}</Table.HeaderCell>)}
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
    // if (!courseId) return <h2>Ei kurssia</h2>
    const { activeCourse } = this.props
    // console.log(csv)
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
            {csv ? <p>Opiskelijanumerot sarakkeessa: <b>{csv.data[0][studentHeader]}</b></p> : undefined}
            <List>
              {Object.keys(csvMappings).map(suggestion => (
                <List.Item disabled={!csvMappings[suggestion].active}>
                  {csv.data[0][suggestion]} - {csvMappings[suggestion].task.name}
                  <List.Content floated="right">
                    <Dropdown value={csvMappings[suggestion].task.id ? csvMappings[suggestion].task.id : null} placeholder="Valitse vastaava tehtävä" options={activeCourse.tasks.map(task => ({ key: task.id, text: task.name, value: task.id }))} onChange={this.handleMapTask(suggestion)} />
                    <Button icon="delete" basic color="red" value={suggestion} onClick={this.removeCsvHeader} />
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
                {Object.keys(pointsMapping).map(key =>
                  <List.Item>{key} = {pointsMapping[key]} <Button basic color="red" size="small" icon="delete" value={key} onClick={this.removePointMapping} /></List.Item>)}
              </List>
              <Input name="pointKey" label="arvo" type="text" value={pointKey} onChange={this.handlePointChange} />
              <Input name="pointValue" label="pistemäärä" type="number" value={pointValue} onChange={this.handlePointChange} />
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
              content: { content: this.renderCsvTable(csv) } }]}
          />
        : undefined}
      </Grid>
    )
  }
}

UploadResponsesPage.defaultProps = {
  activeCourse: {}
}

export default UploadResponsesPage
