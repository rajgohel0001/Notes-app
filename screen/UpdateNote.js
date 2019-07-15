import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { updateNote } from '../controllers/NoteController';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { height, width } = Dimensions.get('screen');
import { deleteNote } from '../controllers/NoteController';
import RBSheet from "react-native-raw-bottom-sheet";

export default class UpdateNote extends Component<Props>{
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
            isVisible: false
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
     * @param {*} note
     * delete note
     */
    deleteNote = () => {
        this.setState({ isVisible: true })
        if (!this.state.note) return;

        deleteNote(this.state.note).then(({ result, message }) => {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onDeleteNote');
                this.RBSheet.close();
                this.props.navigation.navigate('Home');
            }
        });
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
     * @param {*} note
     * update note
     */
    updateNote = () => {
        if (!this.state.note) return;

        updateNote(this.state.note).then(({ result, message }) => {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onUpdateNote');
            }
            this.props.navigation.navigate('Home');
        });
    }

    render() {
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <>
                <View style={styles.container}>
                    <TextInput
                        style={[styles.input, styles.generalFontSize]}
                        placeholder='title...'
                        value={this.state.note.noteTitle}
                        onChangeText={(text) => this.changeTxtTitle(text)}
                        onSubmitEditing={this.updateNote}
                    />
                    <TextInput
                        style={[styles.input, styles.generalFontSize]}
                        placeholder='note...'
                        value={this.state.note.noteDetail}
                        onChangeText={(text) => this.changeTxt(text)}
                        onSubmitEditing={this.updateNote}
                        multiline = {true}
                    />
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: this.state.currentButtonColor }]}
                        onPress={this.updateNote}>
                        <Text style={[styles.buttonText, styles.generalFontSize]}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: width, backgroundColor: 'white', elevation: 30, height: 40, bottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('AddNote', { event: this.event }) }}
                        style={styles.floatingMenuButtonStyle}>
                        <Icon name="more-vert"
                            size={30}
                            style={{ color: 'black', padding: 25, opacity: 0.6 }}
                            onPress={() => { this.RBSheet.open(); }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={100}
                        duration={250}
                        customStyles={{
                            container: {
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15
                            }
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                            <Icon
                                name='delete'
                                style={styles.icon}
                                color='red'
                                size={30}
                                onPress={this.deleteNote}
                            />
                            <Text style={{ fontSize: 20 }} onPress={this.deleteNote}>Delete</Text>
                        </View>
                    </RBSheet>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderColor: '#e1e0e0',
        padding: 20,
        height: 'auto',
    },
    generalFontSize: {
        fontSize: 20,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    text: {
        width: '30%',
    },
    buttonContainer: {
        top: 10,
        width: '50%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    floatingMenuButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 60,
    },
});
