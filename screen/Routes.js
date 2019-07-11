import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './Home';
import AddNote from './AddNote';
import UpdateNote from './UpdateNote';

const MainNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Notes',
            headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
        }
    },
    AddNote: {screen: AddNote},
    UpdateNote: {screen: UpdateNote}
  });

  const Routes = createAppContainer(MainNavigator);

export default Routes;