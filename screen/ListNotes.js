import React, { Component } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import Note from '../models/Note';
import NoteView from './NoteView';

export default class ListNotes extends Component<Props>{
    constructor(props: Props) {
        super(props);

        this.state = {
            notes: this.props.notes,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ notes: nextProps.notes });
    }

    goToScreenUpdateNote = () => {
        if (!this.state.note || !this.props.navigation)
            return;

        const { navigate } = this.props.navigation;
        navigate('UpdateNote', { note: this.state.note.clone(), event: this.props.event })
    }

    renderListNotes = () => {
        // let result;
        return(
        <FlatList
            data={this.state.notes}
            renderItem={(note: any) =>{
                if (note) {
                    // let n = new Note(note['noteId'], note['noteDetail'], note['noteTitle']);
                    // console.log('n=====',n);
                    return <NoteView key={note.noteId} note={note} event={this.props.event} onPress={this.goToScreenUpdateNote} />
                }    
            }}
        />
        )
        // result = this.state.notes.map((note: any) => {
        //     if (note) {
        //         let n = new Note(note['noteId'], note['noteDetail'], note['noteTitle']);
        //         return <NoteView key={n.noteId} note={n} event={this.props.event} onPress={this.goToScreenUpdateNote} />
        //     }
        // });
        // return result;
    }

    render() {
        console.log('notes-----', this.state.notes);
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