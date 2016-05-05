
import React, {Component, View, ScrollView, Text} from 'react-native'
import SwipeCards from 'react-native-swipe-cards'
import {xenia} from '../utils'

export default class QuickFlagging extends Component {

  constructor(props) {
    super(props)
    this.state = { comments: [], loading: true }
  }

  componentWillMount() {
    this.getComments()
    .then(res => this.setState({
      comments: res.results[0].Docs,
      loading: false
    }))
  }

  getComments() {
    return xenia().collection('comments')
      .match({ 'status': 'Untouched' })
      .limit(20).include(['body', '_id', 'status'])
      .exec()
  }

  render() {
    const {comments, loading} = this.state
    return  loading ? <Text>Loading...</Text> : (
      <SwipeCards
        style={styles.container}
        cards={comments}
        renderCard={comment => <Card comment={comment} />}
        renderNoMoreCards={() => <Empty />}
        handleYup={this.handleYup}
        handleNope={this.handleNope} />
    )
  }

  handleYup() {
    // TODO
  }

  handleNope() {
    // TODO
  }
}

class Card extends Component {
  render() {
    const {comment} = this.props
    return (
        <View style={styles.card}>
          <ScrollView style={styles.textContainer}>
            <Text style={styles.cardText}>{comment.body}</Text>
          </ScrollView>
        </View>
    )
  }
}

class Empty extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>Inbox zero!</Text>
      </View>
    )
  }
}

const styles = {
  container: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 10
  },
  cardText: {
    textAlign: 'center',
    fontSize: 16
  }
}
