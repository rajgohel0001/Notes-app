import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import Note from '../models/Note';
import { createNote } from '../controllers/NoteController';

export default class AddNote extends Component<Props>{

    constructor(props: Props) {
        super(props);
        this.state = {
            note: new Note(),
            disableButtonCreate: true,
            disableColor: '#f488f4',
            enableColor: '#800080',
            currentButtonColor: '#f488f4',
            event: this.props.event
        };
    }

    componentWillMount() {
        if (!this.state.note) return;

        if (''.includes(this.state.note.noteDetail)){
            this.setState({ disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        } else {
            this.setState({ disableButtonCreate: false, currentButtonColor: this.state.enableColor });
        }
    }

    /**
     * change note text
     */
    changeTxt = (text: string) => {
        let note = this.state.note;
        if (!note) return;

        note.noteDetail = text;
        if (''.includes(this.state.note.noteDetail)){
            this.setState({ note, disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        } else {
            this.setState({ note, disableButtonCreate: false, currentButtonColor: this.state.enableColor });
        }
    }

    /**
     * change note title
     */
    changeTxtTitle = (text: string) => {
        let note = this.state.note;
        if (!note) return;

        note.noteTitle = text;
        if (''.includes(this.state.note.noteTitle)){
            this.setState({ note, disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        } else {
            this.setState({ note, disableButtonCreate: false, currentButtonColor: this.state.enableColor });
        }
    }

    /**
     * @param {*} note detail
     * add note
     */
    createNote = () => {
        if (!this.state.note) return;

        createNote(this.state.note).then(({ result, message }) => {
            console.log('========', result)
            ToastAndroid.show(message, ToastAndroid.SHORT);
            console.log('meaasge:s', message)
            if (result) {
                this.setState({ note: new Note() });
                Keyboard.dismiss();
                this.props.navigation.state.params.event.emit('onCreateNote');
            }
            this.props.navigation.navigate('Home');
        });
    }

    render() {
        return (
            <View style={[styles.container, {marginTop: 20}]}>
                <TextInput
                    style={[styles.input, styles.generalFontSize]}
                    onChangeText={(text) => this.changeTxtTitle(text)}
                    placeholder={'Add Title'}
                    onSubmitEditing={this.createNote}
                />
                <TextInput
                    style={[styles.input, styles.generalFontSize]}
                    onChangeText={(text) => this.changeTxt(text)}
                    placeholder={'Add Note'}
                    onSubmitEditing={this.createNote}
                    multiline = {true}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: this.state.currentButtonColor }]}
                    onPress={this.createNote}>
                    <Text style={[styles.buttonText, styles.generalFontSize]}> Add </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
        height: 'auto',
    },
    input: {
        // height: 50,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    generalFontSize: {
        fontSize: 20,
    },
    buttonText: {
        color: 'white',
    },
    addButton: {
        top: 10,
        width: '50%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    }
});