
import React, {Component, View, Image, StyleSheet, TouchableHighlight} from 'react-native';

export default class TopBar extends Component {
  render() {
    const {onMenuPress} = this.props
    return (
      <View style={styles.topbar}>
        <View style={styles.iconContainer}>
          <TouchableHighlight style={styles.icon} underlayColor='#f77160' onPress={onMenuPress}>
            <Image style={styles.icon} source={require('../assets/hamburger.png')} />
          </TouchableHighlight>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.icon} source={require('../assets/logo.png')} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topbar: {
    height: 50,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#f77160',
    alignItems: 'center'
  },
  iconContainer: {
    flex: 1
  },
  logoContainer: {
    flex: 1,
    marginLeft: -48
  },
  icon: {
    width: 32,
    height: 32
  }
})
