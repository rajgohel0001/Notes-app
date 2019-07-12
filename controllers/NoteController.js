import Note from '../models/Note';
import Message from '../models/Message';

const SQLite = require('react-native-sqlite-storage');
const sqlite = SQLite.openDatabase({ name: 'note-db', createFromLocation: '~database/note-db.sqlite' })

/**
 * @param {*} note
 * create note 
 */
export const createNote = (note: Note) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }

        sqlite.transaction((tx) => {
            tx.executeSql('INSERT INTO Note(NoteDetail) VALUES (?)', [note.noteDetail], (tx, results) => {
                if (results.rowsAffected > 0) {
                    msg.result = true;
                    msg.message = 'Create new note successfully!';
                } else {
                    msg.result = false;
                    msg.message = 'Create new note failed!';
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
 * get all notes
 */
export const getAllNotes = () => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        msg.result = [];
        sqlite.transaction((tx) => {
            tx.executeSql('SELECT * FROM Note', [], (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
                    let item = results.rows.item(i);
                    let note = new Note(item.NoteId, item.NoteDetail);
                    msg.result.push(note);
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
export const deleteNote = (note: Note) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }

        sqlite.transaction((tx) => {
            tx.executeSql('DELETE FROM Note WHERE NoteId=?', [note.noteId], (tx, results) => {
                if (results.rowsAffected > 0) {
                    msg.result = true;
                    msg.message = `Delete note with id=${note.noteId} successfully!`;
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
export const updateNote = (note: Note) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        if (!note) {
            msg.result = false;
            msg.message = 'Invalid note input!';
            resolve({ result: msg.result, message: msg.message });
        }

        sqlite.transaction((tx) => {
            tx.executeSql('UPDATE Note SET NoteDetail=? WHERE NoteId=?', [note.noteDetail, note.noteId], (tx, results) => {
                if (results.rowsAffected > 0) {
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
 * get user by id 
 */
export const getNoteById = (id: number) => {
    return new Promise((resolve, reject) => {
        let msg = new Message();
        sqlite.transaction((tx) => {
            tx.executeSql('SELECT * FROM Note WHERE NoteId=?', [id], (tx, results) => {
                if (results.rows.length > 0) {
                    let item = results.rows.item(0);
                    let note = new Note(item.NoteId, item.NoteDetail);
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
 * check user if exists
 */
const checkIfNoteExists = (id: number) => {
    getNoteById(id).then(({ result, message }) => {
        let msg = new Message();
        msg.result = note != null;
        if (msg.result)
            msg.message = `Found 1 note with id=${id}`;
        else msg.message = `Not found note with id=${id}`;
        resolve({ result: msg.result, message: msg.message });
    });
}