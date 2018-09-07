import React from 'react'
import { Button, Dropdown, List } from 'semantic-ui-react'

const CsvTaskMapping = ({
  activeCourse, activeType, csv, csvMappings, handleMapTask, toggleCsvHeader
}) => (
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
            onChange={handleMapTask}
          />
          <Button
            basic
            circular
            color={csvMappings[suggestion].active ? 'green' : 'red'}
            icon={csvMappings[suggestion].active ? 'checkmark' : 'minus'}
            size="mini"
            value={suggestion}
            onClick={toggleCsvHeader}
          />
        </List.Content>
      </List.Item>))}
  </List>
)

export default CsvTaskMapping
