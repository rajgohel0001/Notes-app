import React, { Component } from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
// import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';
import { deleteNote } from '../controllers/NoteController';

class NoteView extends Component <Props>{
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
            <View style={styles.container}>
                <Icon
                    name='delete'
                    style={styles.icon}
                    color='red'
                    size={30}
                    onPress={this.deleteNote}
                />
                <Icon
                    name='edit'
                    style={styles.icon}
                    color='green'
                    size={30}
                    onPress={this.goToScreenUpdateNote}
                />
                <Text style={styles.generalFontSize}>{this.state.note.noteDetail}</Text>
            </View>
        );
    }
}

export default withNavigation(NoteView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'row',
        width: '100%',
        marginVertical: 5,
    },
    generalFontSize: {
        fontSize: 20,
    },
    icon: {
        marginHorizontal: 5,
    },
});
