import React, { Component } from 'react';
import { StyleSheet, Text, View, ToastAndroid, FlatList, CheckBox } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteNote } from '../controllers/NoteController';
import alertService from '../service/alertService';

class NoteView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note,
            event: this.props.event,
            height: []
        };
        // console.log('this.props.note==============>', this.props.note);
        if (this.props.note.item.checkList) {
            // let checklist = JSON.parse(this.props.note.item.checkList);
            // console.log("checklist after parse================>", checklist);
            // const type = typeof JSON.parse(this.props.note.item.checkList);
            // console.log('type:', type);
            // this.props.note.item.checkList = checklist;
            // console.log("final====================>", this.props.note);
            this.setState({ note: this.props.note })
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ note: nextProps.note });
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            note: nextProps.note
        }
    }

    /**
     * @param {*} note
     * delete note
     */
    deleteNote = () => {
        this.setState({ isVisible: true })
        if (!this.state.note.item) return;

        deleteNote(this.state.note.item).then(({ result, message }) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT);
            alertService.alerAndToast(message);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onDeleteNote');
                this.RBSheet.close();
                // this.props.navigation.navigate('Home');
            }
        });
    }

    renderNote = () => {
        console.log('checklistttt============>', typeof this.state.note.item.checkList);
        // if (typeof this.state.note.item.checkList === 'string') {
        //     let checklist = JSON.parse(this.state.note.item.checkList);
        //     console.log("parse checklist=============>", checklist)
        // }
        // if (this.state.note.item && this.state.note.item.checkList && this.state.note.item.checkList.length) {
        //     this.state.note.item.checkList = JSON.parse(JSON.stringify(this.state.note.item.checkList));
        // }
        // console.log('lenght of checklisrt:', JSON.parse(JSON.stringify(this.state.note.item.checkList)));
        // console.log('checked its: ', this.state.note.item.checkList.length != 0);
        if (this.state.note.item.checkList && this.state.note.item.checkList.length != 0) {
            return (
                this.state.note.item.checkList.map((note, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={note.isChecked == 0 ? false : true}
                            />
                            <Text style={[styles.generaldetail,
                            {
                                marginTop: 5, textDecorationLine: note.isChecked == 0 ? 'none' : 'line-through',
                                textDecorationStyle: 'solid'
                            }]}>
                                {note.note}
                            </Text>
                        </View>
                    )
                })
                // <FlatList
                //     data={this.state.note.item.checkList}
                //     renderItem={(listData) => {
                //         return (
                //             console.log('render item=====', listData),
                //             <View style={{ flexDirection: 'row' }}>
                //             <CheckBox></CheckBox>
                //             <Text style={{ marginTop: 5 }}>{listData.item.note}</Text>
                //             </View>
                //         )
                //     }}
                // ></FlatList>
            )
        }
    }

    /**
     * update note
     */
    goToScreenUpdateNote = () => {
        if (!this.state.note || !this.props.navigation) return;

        const { navigate } = this.props.navigation;
        navigate('UpdateNote', { note: this.state.note.item.clone(), event: this.props.event })
    }

    render() {
        console.log('state note====', this.state.note);
        // console.log('height', this.state.height);
        if (!this.state.note)
            return <Text style={styles.generalFontSize}>No note found!</Text>

        return (
            <>
                <Ripple
                    onPress={this.goToScreenUpdateNote}
                    onLongPress={() => this.RBSheet.open()}>
                    <View style={styles.container}
                        onLayout={(event) => {
                            const { x, y, width, height } = event.nativeEvent.layout;
                            // console.log('view detail=======', x, y, width, height);
                            this.setState({ height: height })
                        }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.generalFontSize}>{this.state.note.item.title}</Text>
                            {this.state.note.item.hasCheckList == 0 ?
                                <Text style={styles.generaldetail}>{this.state.note.item.detail}</Text> : null
                                // <FlatList
                                //     data={this.state.note.item.checkList}
                                //     renderItem={(item) => {
                                //         console.log('render item=====',item),
                                //         <Text>{item.note}</Text>
                                //     }}
                                // ></FlatList>
                                // this.state.note.item.checkList.map((note) => {
                                //     return (
                                //         <Text>{note.note}</Text>
                                //     )
                                // })
                            }
                            {this.renderNote()}
                            {/* {this.state.note.item.checkList.length ? <Text>found</Text> : <Text>not found</Text>} */}
                            {/* <Text style={styles.generaldetail}>{this.state.note.item.checkList}</Text> */}
                        </View>
                        {this.state.height === 200 ? <Text style={{ top: 150, left: 5, fontSize: 18 }}>...</Text> : null}
                    </View>
                </Ripple>
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
                            <Text style={{ fontSize: 20 }} onPress={this.deleteNote}>Delete</Text>
                        </View>
                    </RBSheet>
                </View>
            </>
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