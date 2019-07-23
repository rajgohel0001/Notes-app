import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Text, ToastAndroid, TouchableOpacity, BackHandler, Animated, CheckBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Note from '../models/Note';
import { createNote } from '../controllers/NoteController';

let array = [];
let tempCheckValues = [];

export default class CheckList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note: new Note(),
            ViewArray: [],
            DisableButton: false,
            isChecked: false,
            checklist: '',
            event: this.props.event,
            checkBoxChecked: []
        };
        this.animatedValue = new Animated.Value(0);
        this.ArrayValueIndex = 0;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.createNote);
    }

    componentWillUnmount() {
        this.backHandler.remove();
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
    createNote = () => {
        console.log("this.state.note: ", this.state.note)
        if (!this.state.note.title) {
            ToastAndroid.show("Enter note title.", ToastAndroid.SHORT);
        } else {
            this.state.note.checkList = (JSON.stringify(array)).toString();
            this.state.note.hasCheckList = this.props.navigation.state.params.hasCheckList;
            console.log("string: ", JSON.stringify(array));
            console.log("final note: ", typeof this.state.note.checkList, this.state.note);
            createNote(this.state.note).then(({ result, message }) => {
                // console.log('result:', result);
                // console.log('state', this.state.note);
                ToastAndroid.show(message, ToastAndroid.SHORT);
                this.props.navigation.state.params.event.emit('onCreateNote');
                // console.log('meaasge:', message);
                if (result) {
                    this.setState({ 'note.noteDetail': '' });
                    // this.props.navigation.state.params.event.emit('onCreateNote');
                }
                // this.props.navigation.navigate('Home');
            });
        }
    }

    // changeTxt = (text) => {
    //     let note = this.state.note;
    //     if (!note) return;

    //     note.detail = text;
    //     this.setState({ note });

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
    // }

    changeNote(index, detail) {
        let checkBoxArray = this.state.checkBoxChecked;
        console.log(index, detail, checkBoxArray);
        let isCheckedValue = checkBoxArray[index];
        const obj = {
            note: detail,
            isChecked: isCheckedValue == true ? 1 : 0
        }
        console.log('object=====', obj);
        // array.push(obj);
        array[index] = obj;
        console.log('array=====', array);
        // this.setState({
        //     checklistArr: [...this.state.checklistArr, obj]
        // })
        // console.log("arrrrrr=========>",arr,this.state.checklistArr)
        // console.log("state=========>", this.state.checklistArr)
    }

    changeTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.title = text;
        this.setState({ note });
    }

    checkListObject(text) {
        console.log('text=====', text);
        const obj = {
            note: text,
            isChecked: 0
        }
        console.log('object=====', obj);
        // let arr = [];
        array.push(obj);
        console.log('array: ', array);
        this.setState({
            checklistArr: [...this.state.checklistArr, obj]
        })
        // console.log("arrrrrr=========>",arr,this.state.checklistArr)
        console.log("state=========>", this.state.checklistArr)
    }

    /**
     * 
     * @param {*} id 
     * @param {*} value
     * change checkbox value 
     */
    checkBoxChanged(id, value) {
        this.setState({
            checkBoxChecked: tempCheckValues
        })
        let tempCheckBoxChecked = this.state.checkBoxChecked;
        tempCheckBoxChecked[id] = !value;
        this.setState({
            checkBoxChecked: tempCheckBoxChecked
        })
        console.log('checkbox:', this.state.checkBoxChecked);
    }

    render() {
        console.log('view array:', this.state.ViewArray);
        console.log('array index:', this.ArrayValueIndex);
        console.log('note:', this.state.note);
        console.log('hasCheckList:', this.props.navigation.state.params.hasCheckList);

        /**
         * render animated view
         */
        let RenderAnimatedView = this.state.ViewArray.map((item, key) => {
            { tempCheckValues[key] = false }
            return (
                <Animated.View
                    key={key}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <CheckBox
                            value={this.state.checkBoxChecked[key]}
                            onValueChange={() => this.checkBoxChanged(key, this.state.checkBoxChecked[key])}
                        />
                        <TextInput
                            placeholder='Note'
                            style={[styles.generalFontSize, { bottom: 10, left: 10 }]}
                            // onBlur={(e) =>{this.checkListObject(e)}}
                            onChangeText={(txt) => this.changeNote(key, txt)}>
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