import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Menu } from 'semantic-ui-react'
import { getUsersCourses, getUserAction } from '../../actions/actions'

class UserPage extends Component {
  state = {
    courses: []
  }

  componentDidMount = async () => {
    this.props.dispatchGetUser()
    getUsersCourses().then(res => this.setState({ courses: res.data }))
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {this.props.user ? <h1>Hello {this.props.user.name}</h1> : <p>Hello bastard</p>}
        <Menu vertical tabular>
          {this.state.courses.map(course =>
            <Menu.Item key={course.id}>{course.name}</Menu.Item>)}
        </Menu>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchGetUser: () =>
    dispatch(getUserAction())
})

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
