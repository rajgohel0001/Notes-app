import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, ToastAndroid, Dimensions, Animated, BackHandler } from 'react-native';
import { updateNote } from '../controllers/NoteController';
import Icon from 'react-native-vector-icons/MaterialIcons';
// const { height, width } = Dimensions.get('screen');
import { deleteNote } from '../controllers/NoteController';
import RBSheet from "react-native-raw-bottom-sheet";
import alertService from '../service/alertService';
import CheckBox from 'react-native-check-box';
import { Header } from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let array = [];
let arraySecond = [];
let tempCheckValues = [];
let tempCheckValuesSecond = [];
let mainArray = [];
let checkLineThrough = [];

export default class UpdateNote extends Component {
    constructor(props) {
        super(props);

        let note, event;
        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) {
            note = this.props.navigation.state.params.note;
            event = this.props.navigation.state.params.event;
        }

        this.state = {
            note: note,
            event: event,
            isVisible: false,
            ViewArray: [],
            DisableButton: false,
            isChecked: false,
            checklist: '',
            checkBoxChecked: [],
            checkBoxCheckedSecond: []
        };
        this.animatedValue = new Animated.Value(0);
        this.ArrayValueIndex = 0;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.updateNote);
        array = this.state.note.checkList;
        // console.log('array componentdid:', array);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * @param {*} note
     * delete note
     */
    deleteNote = () => {
        this.setState({ isVisible: true })
        if (!this.state.note) return;

        deleteNote(this.state.note).then(({ result, message }) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onDeleteNote');
                this.RBSheet.close();
                this.props.navigation.navigate('Home');
            }
        });
    }

    /**
     * 
     * @param {*} index 
     * @param {*} detail 
     * update old checklist
     */
    changeNote(index, detail) {
        console.log(index, detail);
        if (detail) {
            const obj = {
                note: detail,
                isChecked: 0
            }
            console.log('array object', obj);
            array[index] = obj;
        } else {
            array.splice(index,1);
        }
        console.log('array:', array);
    }

    /**
     * 
     * @param {*} index 
     * @param {*} detail 
     * update new checklist
     */
    changeNoteSecondArray(index, detail) {
        console.log('Index and detail-=-=', index, detail);
        const obj = {
            note: detail,
            isChecked: 0
        }
        console.log('arraySecond object:', obj);
        // array.push(obj);
        arraySecond[index] = obj;
        this.setState({

        })
        console.log('arraySecond:', arraySecond);
    }

    /**
    * 
    * @param {*} id 
    * change object value for animated checkbox
    */
    objectWithIdSecond(id) {
        console.log('id:', id);
        const checkBoxArray = this.state.checkBoxCheckedSecond;
        console.log('checkBoxArray:', checkBoxArray);
        if (arraySecond[id] != null) {
            const isCheckedValue = checkBoxArray[id];
            console.log("array id ischecked:", arraySecond[id].isChecked)
            arraySecond[id].isChecked = isCheckedValue == true ? 1 : 0;
            console.log("arraySecond id ischecked:", arraySecond[id].isChecked, arraySecond[id]);
        } else {
            // ToastAndroid.show("Enter note.", ToastAndroid.SHORT);
            alertService.alerAndToast("Enter note in checklist");
        }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} value 
     * change animated view checkbox 
     */
    checkBoxChangedSecond(id, value) {
        if (arraySecond[id] != null) {
            this.setState({
                checkBoxCheckedSecond: tempCheckValuesSecond
            });
            let tempCheckBoxChecked = this.state.checkBoxCheckedSecond;
            tempCheckBoxChecked[id] = !value;
            this.setState({
                checkBoxCheckedSecond: tempCheckBoxChecked
            });
            checkLineThrough[id] = tempCheckBoxChecked[id];
            console.log('checkLineThrough-=-=', checkLineThrough);
            this.objectWithIdSecond(id);
        } else {
            alertService.alerAndToast("Enter note first");
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
        const isCheckedValue = checkBoxArray[id];
        console.log("array id ischecked:", array[id].isChecked)
        array[id].isChecked = isCheckedValue == true ? 1 : 0;
        console.log("array id ischecked:", array[id].isChecked, array[id])
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
            });
            let tempCheckBoxChecked = this.state.checkBoxChecked;
            tempCheckBoxChecked[id] = !value;
            this.setState({
                checkBoxChecked: tempCheckBoxChecked
            });
            this.objectWithId(id);
        } else {
            alertService.alerAndToast("Enter note first");
        }
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
     * change note text
     */
    changeTxt = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.detail = text;
        this.setState({ note })
        // this.updateNote();
    }

    /**
     * change note title
     */
    changeTxtTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.title = text;
        this.setState({ note })
        // this.updateNote();
    }

    /**
     * @param {*} note
     * update note
     */
    updateNote = () => {
        console.log('note in updateNote:', this.state.note);
        if (this.state.note.hasCheckList == 0) {
            if (!this.state.note.title && !this.state.note.detail) {
                // alertService.alerAndToast("Empty note discarded");
                this.deleteNote();
            } else {
                let object = { ...this.state.note };
                console.log('object:', object);
                console.log('after parsing the object:', object);
                updateNote(object).then(({ result, message }) => {
                    // ToastAndroid.show(message, ToastAndroid.SHORT);
                    if (result) {
                        if (this.state.event) {
                            this.state.event.emit('onUpdateNote');
                        }
                    }
                    array = [];
                    arraySecond = [];
                    mainArray = [];
                    // this.props.navigation.navigate('Home');
                });
            }
        } else if (this.state.note.hasCheckList == 1) {
            // console.log('inside====', this.state.note.title, mainArray, array, arraySecond);
            if (!this.state.note.title && !mainArray.length && !array.length) {
                // alertService.alerAndToast("Empty note discarded");
                this.deleteNote();
            } else {
                mainArray = array.concat(arraySecond);
                console.log('mainArray:', mainArray, this.state.note.hasCheckList);
                let object = { ...this.state.note };
                console.log('object:', object);
                if (!object.detail.length) {
                    object.checkList = (JSON.stringify(mainArray)).toString();
                }
                console.log('after parsing the object:', object);
                updateNote(object).then(({ result, message }) => {
                    // ToastAndroid.show(message, ToastAndroid.SHORT);
                    if (result) {
                        if (this.state.event) {
                            this.state.event.emit('onUpdateNote');
                        }
                    }
                    array = [];
                    arraySecond = [];
                    mainArray = [];
                    // this.props.navigation.navigate('Home');
                });
            }
        }
    }

    render() {
        console.log('update note:', this.state.note);
        console.log('checkBoxChecked:', this.state.checkBoxChecked);
        console.log('checkBoxCheckedSecond:', this.state.checkBoxCheckedSecond);
        console.log('checkLineThrough:', checkLineThrough);
        /**
         * render animated view
         */
        let RenderAnimatedView = this.state.ViewArray.map((item, key) => {
            { tempCheckValuesSecond[key] = false }
            // { checkLineThrough[key] = false }
            return (
                <Animated.View
                    key={key}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: Platform.OS == 'ios' ? 5 : null }}>
                        <CheckBox
                            style={{ marginTop: Platform.OS == 'ios' ? 7 : 13 }}
                            // style={styles.checkboxView} android 
                            isChecked={this.state.checkBoxCheckedSecond[key]}
                            onClick={() => this.checkBoxChangedSecond(key, this.state.checkBoxCheckedSecond[key])}
                        />
                        <TextInput
                            placeholder='Note'
                            multiline={true}
                            style={[styles.generalFontSize, { left: Platform.OS == 'ios' ? 10 : null, textDecorationLine: checkLineThrough[key] == 'true' ? 'line-through' : 'none', textDecorationStyle: 'solid', width: '90%' }]}
                            // onBlur={(e) =>{this.checkListObject(e)}}
                            // onFocus={(txt) => this.insertToArray(txt)}
                            onChangeText={(txt) => this.changeNoteSecondArray(key, txt)}
                            autoFocus={true}
                            blurOnSubmit={true}>
                        </TextInput>
                    </View>
                </Animated.View>
            );
        });

        if (!this.state.note)
            return <Text style={styles.generalFontSize}>Invalid note!</Text>

        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.updateNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="arrow-back" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 8 }}></View>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.updateNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="check" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                </Header>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}>
                    {/* <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}> */}
                    <View style={styles.container}>
                        <TextInput
                            style={[styles.input, styles.titleFontSize]}
                            placeholder='Title'
                            value={this.state.note.title}
                            multiline={true}
                            onChangeText={(text) => this.changeTxtTitle(text)}
                            // onSubmitEditing={this.updateNote}
                            blurOnSubmit={true}
                        />
                        {this.state.note.hasCheckList === 0 ?
                            <TextInput
                                style={[styles.input, styles.generalFontSize, { justifyContent: 'center' }]}
                                placeholder='Note'
                                autoFocus={true}
                                value={this.state.note.detail}
                                onChangeText={(text) => this.changeTxt(text)}
                                // onSubmitEditing={this.updateNote}
                                multiline={true}
                            /> :
                            this.state.note.checkList.map((note, index) => {
                                { tempCheckValues[index] = false }
                                if (note) {
                                    return (
                                        <View style={{ flexDirection: 'row', marginBottom: Platform.OS == 'ios' ? 5 : null }}>
                                            <CheckBox
                                                style={{ marginTop: Platform.OS == 'ios' ? 7 : 13 }}
                                                isChecked={note.isChecked == 0 ? false : true}
                                                onClick={() => this.checkBoxChanged(index, note.isChecked == 0 ? false : true)}
                                            />
                                            <TextInput key={index}
                                                placeholder='Note'
                                                style={[styles.generalFontSize, { left: Platform.OS == 'ios' ? 10 : null, textDecorationLine: note.isChecked == 0 ? 'none' : 'line-through', textDecorationStyle: 'solid', width: '90%' }]}
                                                onChangeText={(txt) => this.changeNote(index, txt)}
                                                multiline={true}
                                                autoFocus={true}
                                                blurOnSubmit={true}>
                                                {note.note}
                                            </TextInput>
                                        </View>
                                    )
                                }
                            })
                        }
                        {RenderAnimatedView}
                        {this.state.note.hasCheckList == 1 ?
                            <TouchableOpacity onPress={this.AddNewView}>
                                <Text style={styles.generalFontSize}> + List item </Text>
                            </TouchableOpacity>
                            : null}
                    </View>
                    {/* </KeyboardAvoidingView> */}
                </KeyboardAwareScrollView>
                <View style={{ width: '100%', backgroundColor: 'white', elevation: 30, height: 40, bottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('AddNote', { event: this.event }) }}
                        style={styles.floatingMenuButtonStyle}>
                        <Icon name="more-vert"
                            size={30}
                            style={{ color: 'black', padding: 25, opacity: 0.6 }}
                            onPress={() => { this.RBSheet.open(); }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={100}
                        duration={250}
                        customStyles={{
                            container: {
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15
                            }
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                            <Icon
                                name='delete'
                                style={styles.icon}
                                color='red'
                                size={30}
                                onPress={this.deleteNote}
                            />
                            <Text style={{ fontSize: 20, width: '100%' }} onPress={this.deleteNote}>Delete</Text>
                        </View>
                    </RBSheet>
                </View>
            </>
        );
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
        height: 'auto'
    },
    generalFontSize: {
        fontSize: 20
    },
    titleFontSize: {
        fontSize: 30,
    },
    input: {
        width: '100%',
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    text: {
        width: '30%',
    },
    floatingMenuButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 60,
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
    checkboxView: {
        marginTop: Platform.OS === 'ios' ? 7 : 20,
        right: Platform.OS === 'ios' ? 5 : null
    }
});
