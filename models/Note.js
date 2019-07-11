export default class Note {
    noteId: number;
    noteDetail: string;

    constructor(noteId = 1, noteDetail = '') {
        this.noteId = noteId;
        this.noteDetail = noteDetail;
    }

    clone() {
        return new Note(this.noteId, this.noteDetail);
    }
}