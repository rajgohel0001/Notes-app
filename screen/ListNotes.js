import React, { Component } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import NoteView from './NoteView';

export default class ListNotes extends Component{
    constructor(props) {
        super(props);

        this.state = {
            notes: this.props.notes,
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ notes: nextProps.notes });
    // }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        return{ 
            notes: nextProps.notes 
        }
    }
    
    renderListNotes = () => {
        return(
        <FlatList
            data={this.state.notes}
            renderItem={(note) =>{
                if (note) {
                    return <NoteView key={note.noteId} note={note} event={this.props.event}/>
                }    
            }}
        />
        )
    }

    render() {
        // console.log('notes-----', this.state.notes);
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
        // backgroundColor: '#F5FCFF',
        width: '100%',
        marginTop: 10
    },
});