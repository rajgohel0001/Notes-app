import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, ToastAndroid, Keyboard, BackHandler } from 'react-native';
import Note from '../models/Note';
import { createNote } from '../controllers/NoteController';

export default class AddNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note: new Note(),
            event: this.props.event
        };
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.createNote);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * change note text
     */
    changeTxt = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.noteDetail = text;
        this.setState({ note })
    }

    /**
     * change note title
     */
    changeTxtTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.noteTitle = text;
        this.setState({ note })
    }

    /**
     * @param {*} note detail
     * add note
     */
    createNote = () => {
        if (!this.state.note.noteDetail || !this.state.note.noteTitle){
            ToastAndroid.show("Empty note discarded.", ToastAndroid.SHORT);
        } else {
            createNote(this.state.note).then(({ result, message }) => {
                // console.log('result:', result);
                // console.log('state', this.state.note);
                ToastAndroid.show(message, ToastAndroid.SHORT);
                // console.log('meaasge:', message);
                if (result) {
                    this.setState({ note: new Note() });
                    Keyboard.dismiss();
                    this.props.navigation.state.params.event.emit('onCreateNote');
                }
                this.props.navigation.navigate('Home');
            });
        }
    }

    render() {
        return (
            <View style={[styles.container, { marginTop: 20 }]}>
                <ScrollView>
                    <TextInput
                        style={[styles.input, styles.titleFontSize]}
                        onChangeText={(text) => this.changeTxtTitle(text)}
                        placeholder={'Title'}
                        onSubmitEditing={this.createNote}
                    />
                    <TextInput
                        style={[styles.input, styles.generalFontSize]}
                        onChangeText={(text) => this.changeTxt(text)}
                        placeholder={'Note'}
                        onSubmitEditing={this.createNote}
                        multiline={true}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        height: 'auto',
    },
    input: {
        width: '100%',
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    generalFontSize: {
        fontSize: 20,
    },
    titleFontSize: {
        fontSize: 30,
    }
});