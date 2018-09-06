import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Input, List, Message, Dropdown } from 'semantic-ui-react'
import Papa from 'papaparse'

import { getByCourse } from '../../api/types'
import PointMapping from './PointMapping'
import CsvTable from './CsvTable'

export class UploadResponsesPage extends Component {
  state = {
    activeType: 0,
    csv: undefined,
    csvMappings: {},
    studentHeader: undefined,
    pointsMapping: {},
    responsesCreated: false,
    types: [{ id: 0, text: 'Kaikki' }]
  }

  clearAll = () => {
    this.setState({ csv: undefined, csvMappings: {}, pointsMapping: {} })
    const fileInput = window.document.getElementsByName('fileInput')[0]
    fileInput.value = null
  }

  loadTypes = () => getByCourse({ id: this.props.activeCourse.id }).then(response => this.setState({
    types: this.state.types.concat(response.data.data)
  }))

  loadFile = async (e) => {
    const typePromise = this.loadTypes()
    const { files } = e.target
    Papa.parse(files[0], {
      complete: results => this.setState({ csv: results }, () => this.mapCsvToTasks())
    })
    await typePromise
  }

  mapCsvToTasks = () => {
    const { csv } = this.state
    const { activeCourse } = this.props
    const headers = csv.data[0]
    const suggestions = {}
    headers.forEach((header, i) => {
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

  addPointMapping = (key, value) => {
    const { pointsMapping } = this.state
    this.setState({ pointsMapping: { ...pointsMapping, [key]: Number(value) } })
  }

  removePointMapping = (e, { value }) => {
    const mappings = { ...this.state.pointsMapping }
    delete mappings[value]
    this.setState({ pointsMapping: mappings })
  }

  createNewStudent = (studentnumber) => {
    const number = String(studentnumber)[0] === '0' ? studentnumber : `0${studentnumber}`
    return { id: number, studentnumber: number, task_responses: [] }
  }

  createResponseData = () => {
    const { csv, csvMappings, studentHeader, pointsMapping } = this.state
    const { activeCourse } = this.props
    const students = csv.data
    const tasks = Object.keys(csvMappings).filter(task => csvMappings[task].active)
    const updatedTasks = []
    for (let i = 1; i < students.length; i += 1) {
      const row = students[i]
      const student = (
        activeCourse.people
          .find(person => person.studentnumber.includes(String(row[studentHeader])))
        || this.createNewStudent(String(row[studentHeader]))
      )
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
          if (typeof student.id === 'string') {
            response.studentnumber = student.studentnumber
          }
          if (response.taskId && response.personId && response.points) {
            return response
          }
        })
        updatedTasks.push(...studentTasks.filter(task => task !== undefined))
      }
    }
    this.props.updateHandler(updatedTasks)
    this.setState({ responsesCreated: true })
  }

  removeMessage = () => this.setState({ responsesCreated: false })

  render() {
    const {
      csv,
      csvMappings,
      studentHeader,
      pointsMapping,
      responsesCreated,
      types,
      activeType
    } = this.state
    const { activeCourse } = this.props
    return !activeCourse.id ? <h1>Loading</h1> : (
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <h3>Valitse ladattava csv-tiedosto</h3>
            <Input name="fileInput" type="file" accept=".csv" onChange={this.loadFile} />
            <Button basic color="red" content="tyhjennä valinta" onClick={this.clearAll} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {csv ? (
              <div style={{ marginBottom: '10px' }}>
                <span>Tehtävien tyyppi: </span>
                <Dropdown
                  name="type"
                  selection
                  value={activeType}
                  options={types.map(type => ({
                    key: type.id,
                    text: type.text,
                    value: type.id
                  }))}
                  onChange={(e, { value }) => this.setState({ activeType: value })}
                />
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
                      options={activeCourse.tasks.filter(task => (
                        activeType === 0 || task.types.find(type => type.id === activeType)
                      )).map(task =>
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
              <PointMapping pointsMapping={pointsMapping} addPointMapping={this.addPointMapping} />
            </Grid.Column> : undefined}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h3>Luo palautukset</h3>
            <Button onClick={this.createResponseData}>Luo palautukset</Button>
            {responsesCreated ?
              <Message positive onDismiss={this.removeMessage}>
                Vastaukset luotu, ole hyvä ja tarkista ne tehtävätaulukosta ennen tallentamista.
              </Message> : undefined}
          </Grid.Column>
        </Grid.Row>
        {csv ?
          <CsvTable csv={csv} />
        : undefined}
      </Grid>
    )
  }
}

UploadResponsesPage.propTypes = {
  activeCourse: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })),
    people: PropTypes.arrayOf(PropTypes.shape({
      studentnumber: PropTypes.string.isRequired
    }))
  }).isRequired,
  updateHandler: PropTypes.func.isRequired
}

export default UploadResponsesPage
