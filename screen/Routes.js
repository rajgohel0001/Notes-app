import { createStackNavigator, createAppContainer } from 'react-navigation';
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
    AddNote: {
        screen: AddNote,
        navigationOptions: {
            header: null
        }
    },
    UpdateNote: {
        screen: UpdateNote,
        navigationOptions: {
            header: null
        }
    },
    CheckList: {
        screen: CheckList,
        navigationOptions: {
            header: null
        }
    }
});

const Routes = createAppContainer(MainNavigator);

export default Routes;