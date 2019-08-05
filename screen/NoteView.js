import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, FlatList, TouchableHighlight, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteNote } from '../controllers/NoteController';
import alertService from '../service/alertService';
import CheckBox from 'react-native-check-box';
import RBSheet from "react-native-raw-bottom-sheet";
const width = Dimensions.get('window').width;


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
            // const type = typeof JSON.parse(this.props.note.item.checkList);
            // console.log('type:', type);
            // this.props.note.item.checkList = checklist;
            // console.log("final====================>", this.props.note);
            this.setState({ note: this.props.note })
        }
    }

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
        this.RBSheet.close();
        this.setState({ isVisible: true })
        if (!this.state.note.item) return;

        deleteNote(this.state.note.item).then(({ result, message }) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT);
            // alertService.alerAndToast(message);
            if (result) {
                if (this.state.event)
                    this.state.event.emit('onDeleteNote');
                // this.props.navigation.navigate('Home');
            }
        });
    }

    /**
     * render checklist view
     */
    renderNote = () => {
        console.log('checklistttt============>', typeof this.state.note.item.checkList);
        if (this.state.note.item.checkList && this.state.note.item.checkList.length != 0) {
            return (
                this.state.note.item.checkList.map((note, index) => {
                    if (note && index < 6) {
                        return (
                            <View key={index} style={{ flexDirection: 'row' }}
                                onLayout={(event) => {
                                    const { x, y, width, height } = event.nativeEvent.layout;
                                    console.log('view detail=======', x, y, width, height);
                                }}>
                                <View>
                                    <CheckBox
                                        isChecked={note.isChecked == 0 ? false : true}
                                    />
                                </View>
                                {/* <View style={{ flex: 2 }}></View> */}
                                <View style={{ marginLeft: 5, marginRight: Platform.OS === 'ios' ? 20 : null }}>
                                    <Text numberOfLines={1} style={[styles.generaldetail, {
                                        marginTop: Platform.OS == 'ios' ? 5 : null, textDecorationLine: note.isChecked == 0 ? 'none' : 'line-through',
                                        textDecorationStyle: 'solid', marginRight: 20
                                    }]}>
                                        {note.note}
                                    </Text>
                                </View>
                            </View>
                        )
                    }
                })
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
                            console.log('view detail=======', x, y, width, height);
                            this.setState({ height: height })
                        }}>
                        <View style={{ flexDirection: 'column' }}>
                            {this.state.note.item.title ? <Text style={[styles.generalFontSize, { marginBottom: Platform.OS === 'ios' ? 10 : null }]}>{this.state.note.item.title}</Text> : null}
                            {this.state.note.item.hasCheckList == 0 ?
                                <View style={{ flexDirection: 'row' }}><Text numberOfLines={6} style={[styles.generaldetail, { justifyContent: 'center', flex: 1 }]}>{this.state.note.item.detail}</Text></View> : null
                            }
                            <View>{this.renderNote()}</View>
                        </View>
                        {this.state.height >= 200 ?
                            <View style={{ height: 20 }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#000', marginLeft: 7 }}>...</Text></View> : null}
                    </View>
                </Ripple>
                <View>
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        closeOnDragDown={true}
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

export default withNavigation(NoteView);

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        flex: 1,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e1e0e0',
        borderRadius: 10,
        padding: Platform.OS == 'ios' ? 20 : 15,
        margin: 15,
        height: 'auto',
        maxHeight: 200,
        overflow: 'hidden'

    },
    generalFontSize: {
        fontSize: 18,
    },
    icon: {
        marginHorizontal: 5,
    },
    generaldetail: {
        color: 'gray',
        fontSize: 15,
        textAlign: 'justify',
        marginRight: 10
    }
});