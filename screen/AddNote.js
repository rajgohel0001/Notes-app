import React,{Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import Note from '../models/Note';
import { createNote } from '../controllers/NoteController';

export default class AddNote extends Component <Props>{

    constructor(props: Props){
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

    componentDidMount() {
        console.log("---------value==",this.props.navigation.state.params.event)
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
        if(!note)
            return;
        
        note.noteDetail = text;
        if (''.includes(this.state.note.noteDetail))
            this.setState({ note, disableButtonCreate: true, currentButtonColor: this.state.disableColor });
        else this.setState({ note, disableButtonCreate: false, currentButtonColor: this.state.enableColor }); 
    }
    
    createNote = () => {
        if (!this.state.note)
            return;

        createNote (this.state.note).then(({ result, message }) => {
            console.log('========',result)
            ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {   
                this.setState({ note: new Note() });
                Keyboard.dismiss();
                // if (this.state.event)
                this.props.navigation.state.params.event.emit('onCreateNote');
            }
            this.props.navigation.navigate('Home');
        });
    }

    render() {
        return (
            <View style = {{ marginTop: 20 }}>
                <TextInput 
                    style = { styles.container }
                    onChangeText = {(text) => this.changeTxt(text)}
                    placeholder = {'Add Note'}
                    onSubmitEditing={this.createNote}
                />
                <TouchableOpacity
                    style = { styles.addButton }
                    onPress={ this.createNote }
                >
                    <Text> Add </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e1e0e0',
        borderRadius: 10,
        padding: 20,
        height: 'auto',
      },

      addButton: {
        marginTop: 10,
        backgroundColor: 'lightgray',
        padding: 10,
        width: 55,
        left: 10,
        borderRadius: 10
      }
});