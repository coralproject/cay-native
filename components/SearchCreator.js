
import React, {Component, View, TouchableHighlight, StyleSheet, Slider, Text} from 'react-native'
import UserList from './UserList'
import {xenia} from '../utils'

const filters = [
  {label: 'Total comments', slug: 'count', value: 0},
  {label: 'Total replies written', slug: 'reply_count', value: 0},
  {label: 'Total replies received', slug: 'replied_count', value: 0},
  {label: '% comments that are replies', slug: 'reply_ratio', value: 0},
  {label: 'Replies received per comment', slug: 'replied_ratio', value: 0},
  {label: 'Average words per post', slug: 'word_count_average', value: 0}
]

export default class SearchCreator extends Component {

  constructor(props) {
    super(props)
    this.state = { users: [], showFilters: false, filters, page: 1 }
  }

  componentWillMount() {
    this.fetchMaxValues();
    this.fetchPage(1);
  }

  fetchMaxValues() {
    const group = {_id: null}
    this.state.filters.forEach(f => {
      group[f.slug] = { $max: `$statistics.comments.all.all.${f.slug}` }
    })

    const fs = [...this.state.filters]
    xenia()
    .group(group)
    .exec().then(res => {
      fs.forEach(f => f.maxValue = res.results[0].Docs[0][f.slug])
      this.setState({
        filters: fs
      })
    })

  }

  fetchPage(page) {
    const {filters} = this.state
    const filterQuery = {}
    // apply filters
    filters.forEach(f => {
      filterQuery[`statistics.comments.all.all.${f.slug}`] = { $gte: f.value }
    })

    xenia()
    .match(filterQuery)
    .limit(20).skip((page-1) * 20)
    .exec().then(res => this.setState({
      users: res.results[0].Docs
    }))
  }

  render() {
    const {navigator} = this.props
    const {users, showFilters, filters} = this.state

    if (showFilters) return (
       <Filters applyFilters={this.applyFilters.bind(this)} filters={filters}></Filters>
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

  applyFilters(filters) {
    this.setState({
      filters: filters,
      showFilters: false
    })
    this.fetchPage(1)
  }

}

class Filters extends Component {
  constructor(props) {
    super(props)
    this.state = {filters: this.props.filters}
  }

  render() {
    return (
      <View style={styles.filtersContainer}>
        <TouchableHighlight
          style={styles.applyFilters}
          onPress={this.applyFilters.bind(this)}
          underlayColor='#dd0000'>
          <Text style={styles.applyFiltersText}>Apply filters</Text>
        </TouchableHighlight>
        {filters.map(this.renderFilter.bind(this))}
      </View>
    )
  }

  renderFilter(filter, i) {
    return (
      <View key={i} style={styles.filter}>
        <Text>{filter.label} ({filter.value})</Text>
        <Slider step={Math.ceil(filter.maxValue / 20)} onValueChange={this.updateValue.bind(this, i)}
          style={styles.filterSlide}
          maximumValue={filter.maxValue}  />
      </View>
    );
  }

  updateValue(index, value) {
    filters[index].value = value
    this.setState({ filters })
  }

  applyFilters() {
    this.props.applyFilters(this.state.filters)
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
  selectedSlider: {
    backgroundColor: '#f77160'
  },
  applyFilters: {
    backgroundColor: '#d50000',
    padding: 15
  },
  applyFiltersText: {
    color: '#fff',
    textAlign: 'center'
  },
  filter: {
    padding: 10
  },
  filterSlide: {
  }
})
