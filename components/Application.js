
import React, {Component, Navigator, StyleSheet, View, BackAndroid} from 'react-native'
import SideMenu from 'react-native-side-menu'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import About from './About'
import SearchList from './SearchList'
import SearchDetail from './SearchDetail'
import QuickFlagging from './QuickFlagging'
import UserDetail from './UserDetail'
import SearchCreator from './SearchCreator'

export default class Application extends Component {
  constructor(props) {
    super(props)
    this.state = { menuOpen: false, _navigator: null }
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: 'search-creator'}}
        renderScene={this.renderScene.bind(this)} />
    );
  }

  updateOpenState(isOpen) {
    this.setState({ menuOpen: isOpen })
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this._navigator.getCurrentRoutes().length === 1  ) {
         return false;
      }
      this._navigator.pop();
      return true;
    });

  }

  renderScene(route, navigator) {
    let component
    this._navigator = navigator
    const {menuOpen} = this.state
    const menu = <Sidebar onUpdateNavigation={this.updateOpenState.bind(this, false)} navigator={navigator} />
    switch(route.id) {
      case 'search-list':
        component = <SearchList navigator={navigator} title='Saved Searches' />
        break
      case 'search-detail':
        component = <SearchDetail navigator={navigator} name={route.name} title='Saved Searches' />
        break
      case 'quick-flagging':
        component = <QuickFlagging navigator={navigator} title='Quick Flagging' />
        break
      case 'user-detail':
        component = <UserDetail navigator={navigator} user={route.user} title='User Detail' />
        break
      case 'search-creator':
        component = <SearchCreator navigator={navigator} title='Search Creator' />
        break
      default:
        component = <About navigator={navigator} title='About' />
    }
    return (
      <SideMenu isOpen={menuOpen}
        onChange={this.updateOpenState.bind(this)}
        negotiatePan={true}
        menu={menu}>
        <View style={styles.scene}>
          <TopBar onMenuPress={this.toggleMenu.bind(this)} />
          {component}
        </View>
      </SideMenu>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#ecf0f5'
  }
})
