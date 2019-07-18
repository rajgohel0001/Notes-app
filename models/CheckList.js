export default class Checklist {
    noteId;
    noteDetail;
    noteTitle;
    isChecked;

    constructor(noteId = 1, noteDetail = '', noteTitle = '', isChecked = 0) {
        this.noteId = noteId;
        this.noteDetail = noteDetail;
        this.noteTitle = noteTitle;
        this.isChecked = isChecked;
    }

    clone() {
        return new Note(this.noteId, this.noteDetail, this.noteTitle, this.isChecked);
    }
}