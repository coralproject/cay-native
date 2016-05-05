
import React, {Component, Text, ListView, StyleSheet, View} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import moment from 'moment'
import {xenia} from '../utils'

export default class UserDetail extends Component {
  render() {
    const {user} = this.props
    return (
      <ScrollableTabView tabBarUnderlineColor="#f77160" tabBarActiveTextColor="#f77160">
        <About user={user} tabLabel="About" />
        <Activity userId={user._id} tabLabel="Activity" />
      </ScrollableTabView>
    )
  }
}

class About extends Component {
  render() {
    if(!this.props.user) return (<Text>Loading...</Text>)
    const data = this.getData(this.props.user)
    return (
      <ListView
      dataSource={data}
      enableEmptySections={true}
      renderRow={this.renderRow.bind(this)} />
    )
  }

  getData(user) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const replyPercent = `${Math.floor(user.statistics.comments.all.all.reply_ratio * 100)}%`;
    return ds.cloneWithRows([
      {label: 'Total comment count', value: user.stats.comments},
      {label: 'Total replies received', value: user.statistics.comments.all.all.replied_count},
      {label: 'Total replies written', value: user.statistics.comments.all.all.replied_count},
      {label: 'Comments that are replies', value: replyPercent},
      {label: 'Community flagged', value: user.statistics.comments.all.CommunityFlagged.count}
    ])
  }

  renderRow(item) {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    )
  }
}

class Activity extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {comments: ds.cloneWithRows([]), loaded: false}
  }

  componentWillMount() {
    xenia()
      .exec('comments_by_user', {user_id: this.props.userId})
      .then(res => this.setState({
        comments: this.state.comments.cloneWithRows(res.results[0].Docs),
        loaded: true
      }))
  }

  render() {
    const {comments, loaded} = this.state
    if(!loaded) return (<Text>Loading...</Text>)
    return (
      <ListView
      dataSource={comments}
      enableEmptySections={true}
      renderRow={this.renderRow.bind(this)} />
    )
  }

  renderRow(comment) {
    return (
      <View style={styles.commentCard}>
        <Text style={styles.commentDate}>Created {moment(comment.date_created).fromNow()}</Text>
        <Text style={styles.commentBody}>{comment.body}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1
  },
  value: {
    fontSize: 20
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  commentBody: {
    fontSize: 16,
    marginTop: 10
  },
  commentDate: {
    fontWeight: 'bold'
  }
})
