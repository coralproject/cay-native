
import React, {Component, Text, View, StyleSheet,
  TouchableHighlight, Linking} from 'react-native';

export default class About extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.heading}>What to expect</Text>
          <Text>This is the beta test site for Trust, a tool to find selective value in existing comment sections. We{"'"}re updating it regularly - check back for new versions. Some options may be greyed out. These are features that will be implemented soon.</Text>
        </View>
        <View>
          <Text style={styles.heading}>Send us feedback</Text>
          <View>
            <Text>Is it broken? What would you like to see? </Text>
            <TouchableHighlight underlayColor='#f77160' onPress={this._sendMail}>
              <Text>Email coralcommunity@mozillafoundation.org</Text>
            </TouchableHighlight>
            <Text>, submit an issue (labeled {`'Kind:Bug' or 'Kind:Question'`}) or a pull request on our </Text>
            <TouchableHighlight  underlayColor='#f77160' onPress={this._openRepo}>
              <Text>GitHub repo.</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  _sendMail() {
    Linking.openURL('mailto:coralcommunity@mozillafoundation.org')
    .catch(err => console.error('An error occurred', err));
  }

  _openRepo() {
    Linking.openURL('https://github.com/coralproject/cay')
    .catch(err => console.error('An error occurred', err));
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20
  },
  section: {
    marginBottom: 50
  },
  container: {
    padding: 20
  }
})
