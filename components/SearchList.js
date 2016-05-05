
import React, {Component, StyleSheet, View, Text, ListView, TouchableHighlight} from 'react-native';
import {xenia} from '../utils';

export default class SearchList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      searches: ds.cloneWithRows([])
    }
  }

  componentWillMount() {
    xenia()
    .getQueries()
    .then(searches => this.setState({
      searches: this.state.searches
        .cloneWithRows(searches.filter(s => s.queries[0].collection === 'user_statistics'))
    }))
    .catch(err => alert(err))
  }


  render() {
    const {searches} = this.state;
    return (
      <ListView
        dataSource={this.state.searches}
        enableEmptySections={true}
        renderRow={this.renderSearch.bind(this)} />
    )
  }

  goToDetail(name) {
    this.props.navigator.replace({
      id: 'search-detail',
      name
    })
  }

  renderSearch(search) {
    return (
      <ListItem onSeeDetail={this.goToDetail.bind(this, search.name)} search={search} />
    )
  }

}

class ListItem extends Component {
  render() {
    const {search, onSeeDetail} = this.props
    return (
      <TouchableHighlight underlayColor='#f77160' onPress={onSeeDetail} style={styles.listItem}>
        <View>
          <Text style={styles.name}>{search.name}</Text>
          <Text>{search.desc}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderColor: '#ccc',
    borderBottomWidth: 1
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10
  }
})
