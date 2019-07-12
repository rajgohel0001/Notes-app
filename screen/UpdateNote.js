import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import Note from '../models/Note';
import { updateNote } from '../controllers/NoteController';

export default class UpdateNote extends Component <Props>{
    constructor(props: Props) {
        super(props);

        let note, event;
        if (this.props.navigation
            && this.props.navigation.state
            && this.props.navigation.state.params) {
                note = this.props.navigation.state.params.note;
                event = this.props.navigation.state.params.event;
            }

        this.state = {
            note: note,
            disableButtonCreate: true,
            disableColor: '#f488f4',
            enableColor: '#800080',
            currentButtonColor: '#f488f4',
            event: event,
        };
    }

    componentWillMount() {
        if (!this.state.note)
            return;

        if (''.includes(this.state.note.noteDetail))
            this.setState({ disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        else this.setState({ disableButtonCreate: false, currentButtonColor: this.state.enableColor });
    }

    changeTxt = (text: string) => {
        let note = this.state.note;
        if (!note)
            return;

        note.noteDetail = text;
        if (''.includes(this.state.note.noteDetail))
            this.setState({ note, disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        else this.setState({ note, disableButtonCreate: false, currentButtonColor: this.state.enableColor });
    }

    updateNote = () => {
        if (!this.state.note)
            return;

        updateNote(this.state.note).then(({ result, message }) => {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onUpdateNote');
            }
        });
    }

    render() {
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={[styles.generalFontSize, styles.text]}>Note:</Text>
                    <TextInput
                        style={[styles.input, styles.generalFontSize]}
                        placeholder='note...'
                        value={this.state.note.noteDetail}
                        onChangeText={(text) => this.changeTxt(text)}
                        onSubmitEditing={this.updateNote}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: this.state.currentButtonColor }]}
                    onPress={this.updateNote}>
                    <Text style={[styles.buttonText, styles.generalFontSize]}>Update</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        alignSelf: 'center',
        width: '90%',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    generalFontSize: {
        fontSize: 20,
    },
    input: {
        height: 50,
        width: '70%',
        borderBottomWidth: 1,
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    text: {
        width: '30%',
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
});
