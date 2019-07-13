import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListNotes from './ListNotes';
import AddNote from './AddNote';
import { getAllNotes } from '../controllers/NoteController';
import { EventEmitter } from 'events';

export default class Home extends Component<Props>{
    constructor(props: Props) {
        super(props);

        this.state = {
            notes: [],
        };
        this.event = new EventEmitter();
    }

    componentWillMount() {
        this.initListNotes();
        this.event.addListener('onCreateNote', () => this.initListNotes());
        this.event.addListener('onUpdateNote', () => this.initListNotes());
        this.event.addListener('onDeleteNote', () => this.initListNotes());
    }

    componentWillUnmount() {
        this.event.removeAllListeners();
    }

    initListNotes = () => {
        console.log('caallllll');
        getAllNotes().then(({ result, message }) => this.setState({ notes: result }));
    }

    render() {
        return (
            <>
                <View style={styles.container}>
                    <ListNotes notes={this.state.notes} event={this.event} />
                </View>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate('AddNote', { event: this.event }) }}
                    style={[styles.floatingMenuButtonStyle, { backgroundColor: '#f488f4', borderRadius: 40, height: 60, width: 60 }]}>
                    <Icon name="add"
                        size={30}
                        style={{ color: 'black', padding: 15 }}
                    />
                </TouchableOpacity>
            </>
        )
    }
}

const styles = StyleSheet.create({
    floatingMenuButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});