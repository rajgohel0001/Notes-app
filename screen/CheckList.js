import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Text, ToastAndroid, TouchableOpacity, Animated, CheckBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import checkList from '../models/CheckList';
import { createCheckList } from '../controllers/NoteController';

export default class CheckList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note: new checkList(),
            ViewArray: [],
            DisableButton: false,
            notes: [],
            isChecked: false
        };
        this.animatedValue = new Animated.Value(0);
        this.ArrayValueIndex = 0;
        this.funIschecked = this.funIschecked.bind(this);
        this.funcheck = this.funcheck.bind(this);
    }

    /**
     * add new view
     */
    AddNewView = () => {
        this.animatedValue.setValue(0);
        let NewAddedViewValue = { ArrayValueIndex: this.ArrayValueIndex }
        this.setState({ DisableButton: true, ViewArray: [...this.state.ViewArray, NewAddedViewValue] }, () => {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true
                }
            ).start(() => {
                this.ArrayValueIndex = this.ArrayValueIndex + 1;
                this.setState({ DisableButton: false });
            });
        });
    }

    /**
     * @param {*} note detail
     * add note
     */
    createCheckList = () => {
        console.log('call1');
        if (!this.state.note.noteTitle){
            ToastAndroid.show("Enter note title.", ToastAndroid.SHORT);
        } else {
        console.log('call2');
            createCheckList(this.state.note).then(({ result, message }) => {
                // console.log('result:', result);
                // console.log('state', this.state.note);
                ToastAndroid.show(message, ToastAndroid.SHORT);
                // console.log('meaasge:', message);
                if (result) {
                    // this.setState({ note: new checkList() });
                    // this.props.navigation.state.params.event.emit('onCreateNote');
                }
                // this.props.navigation.navigate('Home');
            });
        }
    }

    changeTxt = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.noteDetail = text;
        this.setState({ note });

        // let notetext = text;
        // this.setState({ notes: [...this.state.notes, notetext] });
        // console.log('notetext: ',this.state.notes);
        
        // note.noteDetail = this.state.notes
        // console.log('string: ',this.state.notes.toString());
        // let Array = [];
        // Array.push(text);
        // console.log('Array: ',Array); 

        // note.noteDetail = text
        // this.setState({ notes: [...this.state.notes, note.noteDetail] });
        // console.log('notes: ',this.state.notes);

        // let joined = this.state.note.noteDetail.concat(text);
        // this.setState({notes: joined});
        // console.log('noteDetail=====',this.state.note.noteDetail);
        // this.state.note.noteDetail.push(text)
        // console.log('noteDetail: ', this.state.note.noteDetail);
        // note.noteDetail = text;
        // this.setState({'note.noteDetail': this.state.notes})
        // this.createNote();
    }

    changeTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.noteTitle = text;
        this.setState({ note });
    }

    funcheck(){
        console.log('ischecked=====',this.state.isChecked);
        this.setState({isChecked: !this.state.isChecked});
    }

    funIschecked() {
        console.log('state data=====', this.state.isChecked);
        // const checked = this.state.isChecked;
       
        if (this.state.isChecked === false) {
            this.setState({ isChecked: true });
        } else {
            this.setState({ isChecked: false });
        }
    }

    render() {

        console.log('view array=====', this.state.ViewArray);
        console.log('array index=====', this.ArrayValueIndex);
        console.log('notes=====', this.state.notes);
        console.log('note=====', this.state.note);
        console.log('string===== ',this.state.notes.toString());

        /**
         * render animated view
         */
        let RenderAnimatedView = this.state.ViewArray.map((item, key) => {
            return (
                <Animated.View
                    key={key}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {this.state.isChecked === false ? <Icon
                            name='check-box-outline-blank'
                            size={30}
                            onPress={this.funIschecked}
                        /> : <Icon
                                name='check-box'
                                size={30}
                                onPress={this.funIschecked}
                            />}
                        <CheckBox 
                            value={this.state.isChecked}
                            onPress={this.funcheck}
                            />
                        <TextInput
                            placeholder='Note'
                            style={[styles.generalFontSize, { bottom: 10, left: 10 }]}
                            onChangeText={(text) => this.changeTxt(text)}
                            onBlur={this.createCheckList}>
                        </TextInput>
                    </View>
                </Animated.View>
            );
        });

        return (
            <View style={styles.container}>
                <ScrollView>
                    <TextInput
                        style={[styles.input, styles.titleFontSize]}
                        placeholder='Title'
                        onChangeText={(text) => this.changeTitle(text)}
                    />
                    <View style={{ flex: 1, padding: 2 }}>
                        {RenderAnimatedView}
                    </View>
                    <TouchableOpacity onPress={this.AddNewView}>
                        <Text style={styles.generalFontSize}> + List item </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
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
    generalFontSize: {
        fontSize: 20,
    },
});