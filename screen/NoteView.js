import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class NoteView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ note: nextProps.note });
    }

    /**
     * update note
     */
    goToScreenUpdateNote = () => {
        if (!this.state.note || !this.props.navigation) return;

        const { navigate } = this.props.navigation;
        navigate('UpdateNote', { note: this.state.note.item.clone(), event: this.props.event })
    }
    fun() {
        if (styles.container.maxHeight == 200){
            return(
                <Text>gfhfh</Text>
            )
        }else{
            return(null)
        }
    }

    render() {
        // console.log('state note====',this.state.note);
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <TouchableOpacity onPress={this.goToScreenUpdateNote}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.generalFontSize}>{this.state.note.item.noteTitle}</Text>
                        <Text style={styles.generaldetail}>{this.state.note.item.noteDetail}</Text>
                      {this.fun()}
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
        borderWidth: 1,
        borderColor: '#e1e0e0',
        borderRadius: 10,
        padding: 10,
        margin: 15,
        height: 'auto',
        maxHeight: 200,
        overflow: 'hidden',
    },
    generalFontSize: {
        fontSize: 18,
    },
    icon: {
        marginHorizontal: 5,
    },
    generaldetail: {
        color: 'gray',
        fontSize: 15
    }
});