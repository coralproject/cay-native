
import React, {Component, View, TouchableHighlight, StyleSheet, Slider, Text} from 'react-native'
import UserList from './UserList'
import {xenia} from '../utils'

export default class SearchCreator extends Component {

  constructor(props) {
    super(props)
    this.state = { users: [], showFilters: false, filters: {} }
  }

  componentWillMount() {
    xenia()
      .limit(20)
    .exec().then(res => this.setState({
      users: res.results[0].Docs
    }))
  }

  render() {
    const {navigator} = this.props
    const {users, showFilters, filters} = this.state
    if (showFilters) return (
       <Filters filters={filters}></Filters>
    )

    return (
      <View>
        <TouchableHighlight
          style={styles.filtersButton}
          onPress={this.openFilters.bind(this)}
          underlayColor='#dd0000'>
          <Text style={styles.filtersButtonText}>Filters</Text>
        </TouchableHighlight>
        <UserList navigator={navigator} users={users} />
      </View>
    )
  }

  openFilters() {
    this.setState({
      showFilters: true
    })
  }

}

class Filters extends Component {
  render() {
    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filter}>
          <Text>Total comments</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View style={styles.filter}>
          <Text>Total replies written</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View style={styles.filter}>
          <Text>Total replies received</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View style={styles.filter}>
          <Text>% comments that are replies</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View style={styles.filter}>
          <Text>Replies received per comment</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View style={styles.filter}>
          <Text>Average words per post</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
        <View>
          <Text>% comments flagged by the system</Text>
          <Slider selectedStyle={styles.selectedSlider}  values={[0,10]} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  filtersButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#d50000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filtersButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  filtersContainer: {
    alignItems: 'center',
    marginRight: 25
  },
  selectedSlider: {
    backgroundColor: '#f77160'
  },
  marker: {
  }
})
