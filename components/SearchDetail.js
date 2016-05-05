
import React, {Component, StyleSheet} from 'react-native'
import UserList from './UserList'
import {xenia} from '../utils'

export default class SearchDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentWillMount() {
    xenia()
    .exec(this.props.name)
    .then(res => this.setState({ users: res.results[0].Docs }))
  }


  render() {
    const {name, navigator} = this.props
    const {users} = this.state
    return (
      <UserList navigator={navigator} users={users} />
    )
  }
}

const styles = StyleSheet.create({
})
