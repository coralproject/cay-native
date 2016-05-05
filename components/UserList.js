
import React, {Component, StyleSheet, ListView, Text, View, Image, TouchableHighlight} from 'react-native'

export default class UserList extends Component {
  render() {
    const {users} = this.props
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    return (
      <ListView
        dataSource={ds.cloneWithRows(users)}
        enableEmptySections={true}
        renderRow={this.renderUser.bind(this)}
        renderHeader={this.renderHeader.bind(this)} />
    )
  }

  renderUser(user) {
    return (
      <TouchableHighlight underlayColor='#f77160' onPress={this.onUserPress.bind(this, user)}>
        <View style={styles.container}>
          <View style={styles.colContainer}>
            <Text numberOfLines={1} style={styles.name}>{user.name}</Text>
            <Text style={styles.datum}>Comments: {user.stats.comments}</Text>
            <Text style={styles.datum}>Replies received: {Math.floor(user.statistics.comments.all.all.replied_ratio * 100)}%</Text>
            <Text style={styles.datum}>Replies written: {Math.floor(user.statistics.comments.all.all.reply_ratio * 100)}%</Text>
          </View>
          <Image source={{uri: user.avatar}} style={styles.avatar} />
        </View>
      </TouchableHighlight>
    )
  }

  onUserPress(user) {
    this.props.navigator.push({
      id: 'user-detail',
      user
    })
  }

  renderHeader() {
    return (
      <Text>{this.props.name}</Text>
    )
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  datum: {
    fontSize: 12
  },
  avatar: {
    width: 64,
    height: 64
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  colContainer: {
    flex: 1
  }
})
