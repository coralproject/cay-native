import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';

const window = Dimensions.get('window');

export default class Sidebar extends Component {
  render() {
    return (
      <View style={styles.menu}>
        <TouchableHighlight style={styles.menuItem} underlayColor='#ccc' onPress={this._navigate.bind(this, 'search-list')}><Text style={styles.item} >Saved Searches</Text></TouchableHighlight>
        <TouchableHighlight style={styles.menuItem} underlayColor='#ccc' onPress={this._navigate.bind(this, 'about')}><Text style={styles.item}>About</Text></TouchableHighlight>
        <TouchableHighlight style={styles.menuItem} underlayColor='#ccc' onPress={this._navigate.bind(this, 'quick-flagging')}><Text style={styles.item}>Quick Flagging</Text></TouchableHighlight>
        <TouchableHighlight style={styles.menuItem} underlayColor='#ccc' onPress={this._navigate.bind(this, 'search-creator')}><Text style={styles.item}>Search Creator</Text></TouchableHighlight>
      </View>
    )
  }

  _navigate(id) {
    this.props.onUpdateNavigation()
    this.props.navigator.replace({ id })
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgb(68, 68, 68)',
  },
  menuItem: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    padding: 20
  },
  item: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8
  }
});
