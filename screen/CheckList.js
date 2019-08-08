import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Text, Platform, TouchableOpacity, BackHandler, Animated } from 'react-native';
import { Header } from "native-base";
import Note from '../models/Note';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createNote } from '../controllers/NoteController';
import alertService from '../service/alertService';
import CheckBox from 'react-native-check-box';

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
        // for (let i = 0; i < array.length; i++) {
        //     console.log("array of i==========>",i,array[i])
        //     if (array[i] == undefined) {
        //         array.splice(i, 1);
        //     }
        //     console.log("spliced array in looppp============>",array)
        // }
        console.log("spliced array============>",array);
        let filteredArray = array.filter((el) => {
            return el != null;
        })
        console.log('filteredArray', filteredArray);
        this.state.note.checkList = (JSON.stringify(filteredArray)).toString();
        console.log("this.state.note: ", this.state.note)
        console.log('cond: ', !this.state.note.title, this.state.note.checkList != null, this.state.note.checkList.length != 0);
        console.log('checklist lebght:', this.state.note.checkList.length);
        if (!this.state.note.title && (!this.state.note.checkList || this.state.note.checkList.length == 2)) {
            // ToastAndroid.show("Empty note discarded.", ToastAndroid.SHORT);
            alertService.alerAndToast("Empty note discarded");
        } else {
            this.state.note.hasCheckList = this.props.navigation.state.params.hasCheckList;
            console.log("string: ", JSON.stringify(array));
            console.log("final note: ", typeof this.state.note.checkList, this.state.note);
            createNote(this.state.note).then(({ result, message }) => {
                // console.log('result:', result);
                // console.log('state', this.state.note);
                // ToastAndroid.show(message, ToastAndroid.SHORT);
                // alertService.alerAndToast(message);
                this.props.navigation.state.params.event.emit('onCreateNote');
                // console.log('meaasge:', message);
                if (result) {
                    this.setState({ 'note.noteDetail': '' });
                    // this.props.navigation.state.params.event.emit('onCreateNote');
                }
                array = [];
                // this.props.navigation.navigate('Home');
            });
        }
    }

    /**
     * 
     * @param {*} id 
     * change object value for checkbox
     */
    objectWithId(id) {
        console.log('id:', id);
        const checkBoxArray = this.state.checkBoxChecked;
        console.log('checkBoxArray:', checkBoxArray);
        if (array[id] != null) {
            const isCheckedValue = checkBoxArray[id];
            console.log("array id ischecked:", array[id].isChecked);
            array[id].isChecked = isCheckedValue == true ? 1 : 0;
            console.log("array id ischecked:", array[id].isChecked, array[id])
        } else {
            // ToastAndroid.show("Enter note.", ToastAndroid.SHORT);
            alertService.alerAndToast("Enter note in checklist");
        }
    }

    /**
     * 
     * @param {*} index 
     * @param {*} detail 
     * save note text detail
     */
    changeNote(index, detail) {
        console.log('detail length: ', detail.length, index);
        if (detail) {
            const obj = {
                note: detail,
                isChecked: 0
            }
            console.log('obj:', obj);
            array[index] = obj;
        } else {
            array.splice(index, 1);
        }
        console.log('array:', array[index], array);
    }

    /**
     * change note title
     */
    changeTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.title = text;
        this.setState({ note });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} value
     * change checkbox value 
     */
    checkBoxChanged(id, value) {
        if (array[id] != null) {
            this.setState({
                checkBoxChecked: tempCheckValues
            })
            let tempCheckBoxChecked = this.state.checkBoxChecked;
            tempCheckBoxChecked[id] = !value;
            this.setState({
                checkBoxChecked: tempCheckBoxChecked
            })
            this.objectWithId(id);
            console.log('checkbox:', this.state.checkBoxChecked);
        } else {
            alertService.alerAndToast("Enter note first");
        }
    }

    render() {
        console.log('view array:', this.state.ViewArray);
        console.log('array index:', this.ArrayValueIndex);
        console.log('note:', this.state.note);
        console.log('hasCheckList:', this.props.navigation.state.params.hasCheckList);
        console.log('array:', array);

        /**
         * render animated view
         */
        let RenderAnimatedView = this.state.ViewArray.map((item, key) => {
            { tempCheckValues[key] = false }
            return (
                <Animated.View
                    key={key}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: Platform.OS == 'ios' ? 5 : null }}>
                        <CheckBox
                            style={{ marginTop: Platform.OS == 'ios' ? 7 : 13, right: 5 }}
                            // style={styles.checkboxView}
                            isChecked={this.state.checkBoxChecked[key]}
                            onClick={() => this.checkBoxChanged(key, this.state.checkBoxChecked[key])}
                        />
                        <TextInput
                            placeholder='Note'
                            style={[styles.generalFontSize, { left: Platform.OS == 'ios' ? 10 : null, width: '90%' }]}
                            onChangeText={(txt) => this.changeNote(key, txt)}
                            // onSubmitEditing={this.createNote}
                            multiline={true}
                            blurOnSubmit={true}
                            autoFocus={true}>
                        </TextInput>
                    </View>
                </Animated.View>
            );
        });

        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.createNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="arrow-back" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 8 }}></View>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.createNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="check" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                </Header>
                <View style={styles.container}>
                    <ScrollView style={{ marginTop: Platform.OS == 'ios' ? 10 : null }}>
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
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: Platform.OS == 'ios' ? null : 20,
        paddingBottom: Platform.OS == 'ios' ? 20 : null,
        paddingRight: Platform.OS == 'ios' ? 20 : null,
        paddingLeft: Platform.OS == 'ios' ? 20 : null,
        height: 'auto',
    },
    header: {
        backgroundColor: "#ffffff",
        height: 50,
        borderBottomColor: Platform.OS == 'ios' ? null : '#000',
        borderBottomWidth: Platform.OS == 'ios' ? null : 1,
        marginTop: Platform.OS == 'ios' ? 20 : null
    },
    iconButton: {
        height: 50,
        width: 50,
        top: Platform.OS === 'ios' ? null : 20
    },
    generalFontSize: {
        fontSize: 20,
    },
    titleFontSize: {
        fontSize: 30
    },
    checkboxView: {
        marginTop: Platform.OS === 'ios' ? 7 : 20,
        right: Platform.OS === 'ios' ? 5 : null
    }
});