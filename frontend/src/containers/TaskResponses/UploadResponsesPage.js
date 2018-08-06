import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Input, List, Table, Dropdown } from 'semantic-ui-react'
import Papa from 'papaparse'

import { getCourseInstanceDataAction } from '../../actions/actions'

export class UploadResponsesPage extends Component {
  state = {
    courseId: undefined,
    csv: undefined,
    csvMappings: {},
    studentHeader: undefined
  }

  componentDidMount() {
    const { courseId } = this.props.match.params
    if (courseId) {
      this.setState({ courseId })
    }
    if (!this.props.activeCourse.id) {
      this.props.dispatchGetCourseInstanceData(courseId)
    }
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

  render() {
    const { courseId, csv, csvMappings, studentHeader } = this.state
    if (!courseId) return <h2>Ei kurssia</h2>
    const { activeCourse } = this.props
    return !activeCourse.id ? <h1>Loading</h1> : (
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <h1>{activeCourse.name}</h1>
            <Input type="file" onChange={this.loadFile} />
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
              <h3>Onko tehtäviä, joiden pistemäärä pitää muuttaa numeraalisiksi?</h3>
              <Dropdown options={csv.data[0].map(header => ({ key: header, text: header, value: header }))} /><Button>Lisää</Button>
            </Grid.Column> : undefined}
        </Grid.Row>
        {csv ?
          <Grid.Row>
            <Grid.Column style={{ overflowX: 'scroll' }}>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {csv.data[0].map(cell => <Table.HeaderCell key={cell}>{cell}</Table.HeaderCell>)}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {csv.data.map((row, i) => (i === 0 ? undefined : <Table.Row key={i}>{row.map((cell, j) => <Table.Cell key={j}>{cell}</Table.Cell>)}</Table.Row>))}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        : undefined}
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  activeCourse: state.instance
})

const mapDispatchToProps = dispatch => ({
  dispatchGetCourseInstanceData: courseId =>
    dispatch(getCourseInstanceDataAction(courseId))
})

UploadResponsesPage.defaultProps = {
  activeCourse: {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadResponsesPage)
