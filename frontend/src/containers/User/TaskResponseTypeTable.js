import React, { Component } from 'react'
import { Button, Table, Segment } from 'semantic-ui-react'



class TaskResponseTypeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'Viikko'
    }
  }

  // <Table.HeaderCell
  //   key={header.id}
  //   colSpan={`${header.types.length}`}
  // >
  //   {header.name}
  // </Table.HeaderCell>)

  getTasksForType = (tasks, typeId) => tasks.filter(task => task.types.find(type => type.id === typeId))

  showTasks = (e) => {
    const { value } = e.target
    this.setState({ selected: value })
  }

  render() {
    const { selected } = this.state
    const { typeHeaders, students, tasks, selectType, updatedTasks } = this.props
    const updatedHeaders = typeHeaders ? typeHeaders.map(header => (
      {
        ...header,
        types: header.types.map(type => (
          {
            ...type,
            updated: this.getTasksForType(tasks, type.id).find(task =>
              updatedTasks.find(ut => ut.taskId === task.id))
          }))
      })) : []
    return (
      <div>
        <div style={{ display: 'inline' }}>
          {updatedHeaders.map(header =>
            (
              <Button
                key={header.id}
                onClick={this.showTasks}
                value={header.name}
                color={selected === header.name ? 'grey' : null}
              >
                {header.name}
              </Button>))}
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan="2">Opiskelija</Table.HeaderCell>
              {/* {updatedHeaders.map(header => <Table.HeaderCell key={header.id} colSpan={`${header.types.length}`}>{header.name}</Table.HeaderCell>)} */}
            </Table.Row>
            <Table.Row>
              {updatedHeaders.filter(upH => upH.name === selected).map(header => header.types.map(type => <Table.HeaderCell key={type.id}><Button onClick={selectType} type={type} color={type.updated ? 'red' : 'grey'}>{type.name}</Button></Table.HeaderCell>))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {students.map(person => (
              <Table.Row key={person.id}>
                <Table.Cell>
                  {person.studentnumber} - {person.name}
                </Table.Cell>
                {updatedHeaders.filter(upH => upH.name === selected).map(header => header.types.map(type => (
                  <Table.Cell key={type.id}>
                    {person.task_responses.filter(response =>
                      this.getTasksForType(tasks, type.id).find(t => t.id === response.task_id))
                      .length} / {this.getTasksForType(tasks, type.id).length}
                  </Table.Cell>
                )))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default TaskResponseTypeTable
