import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, Image } from 'react-native';
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
            this.setState({ notes: respnose.result });
            // console.log('respnose: ', respnose);
        }).catch((error) => {
            console.log('errror: ', error);
        });
    }

    render() {
        console.log('notes: ', this.state.notes);
        return (
            <>
                {!this.state.notes.length ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 100, height: 100 }} source={require('../assets/images/notes4.png')} />
                        <Text style={{ fontSize: 20 }}>
                            Notes you add appear here
                    </Text>
                    </View> :
                    <View style={styles.container}>
                        <ListNotes notes={this.state.notes} event={this.event} />
                    </View>}
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate('AddNote', { event: this.event, hasCheckList: 0 }) }}
                    style={[styles.floatingMenuButtonStyle, { backgroundColor: '#fff', elevation: 25, borderRadius: 40, height: 60, width: 60 }]}>
                    <Icon name="add"
                        size={30}
                        style={{ color: 'black', padding: 15 }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', width: 'auto', backgroundColor: 'white', elevation: 30, height: 40, bottom: 0 }}>
                    <View style={{ flex: 4 }}></View>
                    <View style={{ flex: 3 }}>
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('CheckList', { event: this.event, hasCheckList: 1 }) }}
                            style={styles.navbar}>
                            <Icon name="check-box"
                                size={30}
                                style={{ color: 'black', padding: 25, opacity: 0.6 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}></View>
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
        // alignSelf: 'flex-end',
        alignItems: 'center',
        // justifyContent: 'center',
        // position: 'absolute',
        bottom: 20,
        // height: 60,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF'
    }
});