import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView, ToastAndroid, Dimensions, BackHandler, CheckBox } from 'react-native';
import { updateNote } from '../controllers/NoteController';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { height, width } = Dimensions.get('screen');
import { deleteNote } from '../controllers/NoteController';
import RBSheet from "react-native-raw-bottom-sheet";

export default class UpdateNote extends Component {
    constructor(props) {
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
            event: event,
            isVisible: false
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.updateNote);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * @param {*} note
     * delete note
     */
    deleteNote = () => {
        this.setState({ isVisible: true })
        if (!this.state.note) return;

        deleteNote(this.state.note).then(({ result, message }) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT);
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
    changeTxt = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.detail = text;
        this.setState({ note })
        this.updateNote();
    }

    /**
     * change note title
     */
    changeTxtTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.title = text;
        this.setState({ note })
        this.updateNote();
    }

    /**
     * @param {*} note
     * update note
     */
    updateNote = () => {
        if (!this.state.note.detail) {
            ToastAndroid.show("Enter note details", ToastAndroid.SHORT);
        } else {
            updateNote(this.state.note).then(({ result, message }) => {
                // ToastAndroid.show(message, ToastAndroid.SHORT);
                if (result) {
                    if (this.state.event)
                        this.state.event.emit('onUpdateNote');
                }
                // this.props.navigation.navigate('Home');
            });
        }
    }

    render() {
        console.log('update note: ', this.state.note);
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <>
                <View style={styles.container}>
                    <ScrollView>
                        <TextInput
                            style={[styles.input, styles.titleFontSize]}
                            placeholder='Title'
                            value={this.state.note.title}
                            onChangeText={(text) => this.changeTxtTitle(text)}
                            onSubmitEditing={this.updateNote}
                        />
                        {this.state.note.hasCheckList === 0 ? <TextInput
                            style={[styles.input, styles.generalFontSize]}
                            placeholder='Note'
                            value={this.state.note.detail}
                            onChangeText={(text) => this.changeTxt(text)}
                            onSubmitEditing={this.updateNote}
                            multiline={true}
                        /> :
                            this.state.note.checkList.map((note) => {
                                return (
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox></CheckBox>
                                        <TextInput style={{marginTop: -10}}>{note.note}</TextInput>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
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
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 20,
        height: 'auto',
    },
    generalFontSize: {
        fontSize: 20,
    },
    titleFontSize: {
        fontSize: 30,
    },
    input: {
        width: '100%',
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    text: {
        width: '30%',
    },
    floatingMenuButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 60,
    },
});
