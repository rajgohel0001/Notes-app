import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('screen');
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListNotes from './ListNotes';
import { getAllNotes } from '../controllers/NoteController';
import { EventEmitter } from 'events';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
        };
        this.event = new EventEmitter();
    }

    componentDidMount() {
        this.initListNotes();
        this.event.addListener('onCreateNote', () => this.initListNotes());
        this.event.addListener('onUpdateNote', () => this.initListNotes());
        this.event.addListener('onDeleteNote', () => this.initListNotes());
    }

    // componentWillMount() {
    //     this.initListNotes();
    //     this.event.addListener('onCreateNote', () => this.initListNotes());
    //     this.event.addListener('onUpdateNote', () => this.initListNotes());
    //     this.event.addListener('onDeleteNote', () => this.initListNotes());
    // }

    componentWillUnmount() {
        this.event.removeAllListeners();
    }

    initListNotes = () => {
        getAllNotes().then((respnose) => {
            // getAllNotes().then(({ result, message }) => this.setState({ notes: result }));
            this.setState({ notes: respnose.result});
            // console.log('respnose: ', respnose);
        }).catch((error) => {
            console.log('errror: ', error);
        });
    }

    render() {
        console.log('notes: ', this.state.notes);
        return (
            <>
                <View style={styles.container}>
                    <ListNotes notes={this.state.notes} event={this.event} />
                </View>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate('AddNote', { event: this.event, hasCheckList: 0 }) }}
                    style={[styles.floatingMenuButtonStyle, { backgroundColor: '#fff', elevation: 25, borderRadius: 40, height: 60, width: 60 }]}>
                    <Icon name="add"
                        size={30}
                        style={{ color: 'black', padding: 15 }}
                    />
                </TouchableOpacity>
                <View style={{ width: 'auto', backgroundColor: 'white', elevation: 30, height: 40, bottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('CheckList', { event: this.event, hasCheckList: 1 }) }}
                        style={styles.navbar}>
                        <Icon name="check-box"
                            size={30}
                            style={{ color: 'black', padding: 25, opacity: 0.6, right: 50 }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    floatingMenuButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 50,
        right: 15,
    },
    navbar: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 60,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF'
    }
});