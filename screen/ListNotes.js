import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Note from '../models/Note';
import NoteView from './NoteView';

export default class ListNotes extends Component {
    constructor(props){
        super(props);

        this.state = {
            notes: this.props.notes,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ notes: nextProps.notes });
    }

    renderListNotes = () => {
        let result;
        result = this.state.notes.map((note: any) => {
            if (note) {
                let n = new Note(note['noteId'], note['noteDetail']);
                return <NoteView key={n.noteId} note={n} event={this.props.event} />
            }
        });
        return result;
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.renderListNotes()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        width: '100%',
        marginTop: 10,
    },
});