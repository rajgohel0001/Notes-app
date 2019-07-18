import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './Home';
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';
import CheckList from './CheckList';

const MainNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Notes',
            headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
        }
    },
    AddNote: {screen: AddNote},
    UpdateNote: {screen: UpdateNote},
    CheckList: {screen: CheckList}
  });

  const Routes = createAppContainer(MainNavigator);

export default Routes;