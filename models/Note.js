export default class Note {
    noteId: number;
    noteDetail: string;
    noteTitle: string;

    constructor(noteId = 1, noteDetail = '', noteTitle = '') {
        this.noteId = noteId;
        this.noteDetail = noteDetail;
        this.noteTitle = noteTitle;
    }

    clone() {
        return new Note(this.noteId, this.noteDetail, this.noteTitle);
    }
}