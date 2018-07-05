import React, { Component } from 'react'
import { List, Menu } from 'semantic-ui-react'
import { getJson } from '../../utils/utils'

const userCourses = [{
  id: 1,
  eng_name: 'Linis I kesä 2018',
  fin_name: 'Linis I kesä 2018',
  swe_name: 'Linis I kesä 2018',
  active: false,
  course_id: 1
},
{
  id: 2,
  eng_name: 'Linis I syksy 2018',
  fin_name: 'Linis I syksy 2018',
  swe_name: 'Linis I syksy 2018',
  active: true,
  course_id: 1
},
{
  id: 3,
  eng_name: 'Linis I kevät 2019',
  fin_name: 'Linis I kevät 2019',
  swe_name: 'Linis I kevät 2019',
  active: false,
  course_id: 1
}
]

class UserPage extends Component {
  state = {}

  componentDidMount = async () => {
    getJson('/courses/1').then(res => console.log(res))
  }

  render() {
    return (
      <div>
        <Menu vertical tabular>
          {userCourses.filter(course =>
            !course.active).map(course =>
              <Menu.Item>{course.fin_name}</Menu.Item>)}
        </Menu>
        <p>Hello user</p>
      </div>
    )
  }
}

export default UserPage
