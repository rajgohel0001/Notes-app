import React, { Component } from 'react';
import { StyleSheet, Text, View, ToastAndroid, TouchableOpacity } from 'react-native';
// import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';
import { deleteNote } from '../controllers/NoteController';

class NoteView extends Component<Props>{
    constructor(props: Props) {
        super(props);

        this.state = {
            note: this.props.note,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ note: nextProps.note });
    }

    goToScreenUpdateNote = () => {
        if (!this.state.note || !this.props.navigation)
            return;

        const { navigate } = this.props.navigation;
        navigate('UpdateNote', { note: this.state.note.clone(), event: this.props.event })
    }

    deleteNote = () => {
        if (!this.state.note)
            return;

        deleteNote(this.state.note).then(({ result, message }) => {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {
                if (this.props.event)
                    this.props.event.emit('onDeleteNote');
            }
        });
    }

    render() {
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <TouchableOpacity onPress={this.goToScreenUpdateNote}>
                <View style={styles.container}>
                    <View style={{flexDirection:'column'}}>
                        <Text style={styles.generalFontSize}>{this.state.note.noteTitle}</Text>
                        <Text style={styles.generaldetail}>{this.state.note.noteDetail}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default withNavigation(NoteView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        // backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e1e0e0',
        borderRadius: 10,
        padding: 10,
        margin: 15,
        height: 'auto',
    },
    generalFontSize: {
        fontSize: 18,
    },
    icon: {
        marginHorizontal: 5,
    },
    generaldetail:{
        color:'gray',
        fontSize:15
    }
});


// <Icon
//     name='delete'
//     style={styles.icon}
//     color='red'
//     size={30}
//     onPress={this.deleteNote}
// />