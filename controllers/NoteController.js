import Note from '../models/Note';
import Message from '../models/Message';
import Checklist from '../models/CheckList';

const SQLite = require('react-native-sqlite-storage');
const sqlite = SQLite.openDatabase({ name: 'notes-db', createFromLocation: '~database/notes-db.sqlite' })

/**
 * @param {*} note
 * create note 
 */
export const createNote = (note) => {
    console.log('hey note in contrller: ', note);
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }
        sqlite.transaction((tx) => {
            tx.executeSql('INSERT INTO Note(title, detail, hasCheckList, checkList) VALUES (?,?,?,?)', [note.title, note.detail, note.hasCheckList, note.checkList], (tx, results) => {
                console.log('YOU INSDIE', results);
                if (results.rowsAffected) {
                    console.log('hello its saved');
                    msg.result = true;
                    msg.message = 'Create new note successfully!';
                } else {
                    console.log('hello its not saved');
                    msg.result = false;
                    msg.message = 'Create new note failed!';
                }
                resolve({ result: msg.result, message: msg.message });
            }, (error) => {
                console.log('error: ', error);
                msg.result = false;
                msg.message = `${error.message}`;
                resolve({ result: msg.result, message: msg.message });
            });
        })
    });
}

/**
 * get all notes
 */
export const getAllNotes = () => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        msg.result = [];
        sqlite.transaction((tx) => {
            tx.executeSql('SELECT * FROM Note', [], (tx, results) => {
                // console.log('reustls: here: ', JSON.stringify(results.rows, null, 2));
                // return
                try {
                    for (let i = 0; i < results.rows.length; i++) {
                        let item = results.rows.item(i);
                        // if (item.checkList) {
                        //     const itemCheckList = JSON.parse((item.checkList));
                        //     console.log('itemCheckList: ', itemCheckList)
                        // }
                        // console.log('item====1', typeof itemCheckList, JSON.parse(JSON.stringify(itemCheckList)));
                        // console.log('222: ', JSON.parse(item.checkList));
                        // console.log('item====2', JSON.parse(item.checkList), typeof (JSON.parse(JSON.stringify(item.checkList))));
                        // console.log('item: full: ', item);
                        let note = new Note(item.noteId, item.title, item.detail, item.hasCheckList, item.checkList);
                        msg.result.push(note);
                    }
                } catch (catherr) {
                    console.log('hello error: ', catherr);
                }
                msg.message = 'Get all notes successfully!';
                resolve({ result: msg.result, message: msg.message });
            }, (error) => {
                msg.result = [];
                msg.message = `${error.message}`;
                resolve({ result: msg.result, message: msg.message });
            });
        })
    });
}


/**
 * @param {*} note
 * delete note 
 */
export const deleteNote = (note) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }

        sqlite.transaction((tx) => {
            tx.executeSql('DELETE FROM Note WHERE noteId=?', [note.noteId], (tx, results) => {
                if (results.rowsAffected) {
                    msg.result = true;
                    msg.message = `Note Deleted successfully!`;
                } else {
                    msg.result = false;
                    msg.message = `Not found note with id=${note.noteId}`;
                }
                resolve({ result: msg.result, message: msg.message });
            }, (error) => {
                msg.result = false;
                msg.message = `${error.message}`;
                resolve({ result: msg.result, message: msg.message });
            });
        })
    });
}

/**
 * @param {*} note
 * update note 
 */
export const updateNote = (note) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }

        sqlite.transaction((tx) => {
            tx.executeSql('UPDATE Note SET detail=?, title=? WHERE noteId=?', [note.detail, note.title, note.noteId], (tx, results) => {
                if (results.rowsAffected) {
                    msg.result = true;
                    msg.message = 'Update note successfully!';
                } else {
                    msg.result = false;
                    msg.message = 'Update note failed!';
                }
                resolve({ result: msg.result, message: msg.message });
            }, (error) => {
                msg.result = false;
                msg.message = `${error.message}`;
                resolve({ result: msg.result, message: msg.message });
            });
        })
    });
}

/**
 * 
 * @param {*} id
 * get note by id 
 */
export const getNoteById = (id) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        sqlite.transaction((tx) => {
            tx.executeSql('SELECT * FROM Notes WHERE NoteId=?', [id], (tx, results) => {
                if (results.rows.length) {
                    let item = results.rows.item(0);
                    let note = new Note(item.NoteId, item.NoteDetail, item.NoteTitle);
                    msg.result = note;
                    msg.message = `Found 1 note with id=${id}`;
                } else {
                    msg.result = null;
                    msg.message = `Not found note with id=${id}`;
                }
                resolve({ result: msg.result, message: msg.message });
            }, (error) => {
                msg.result = null;
                msg.message = `${error.message}`;
                resolve({ result: msg.result, message: msg.message });
            });
        })
    });
}

/**
 * 
 * @param {*} id
 * check note if exists
 */
const checkIfNoteExists = (id) => {
    getNoteById(id).then(({ result, message }) => {
        let msg = new Message();
        msg.result = note != null;
        if (msg.result)
            msg.message = `Found 1 note with id=${id}`;
        else msg.message = `Not found note with id=${id}`;
        resolve({ result: msg.result, message: msg.message });
    });
}