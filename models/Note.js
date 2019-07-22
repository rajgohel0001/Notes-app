export default class Note {
    noteId; 
    title;
    detail;
    hasCheckList;
    checkList;

    constructor(noteId = 1, title = '', detail = '', hasCheckList = 0, checkList = '') {
        this.noteId = noteId;
        this.title = title;
        this.detail = detail;
        this.hasCheckList = hasCheckList;
        this.checkList = checkList;
    }

    clone() {
        return new Note(this.noteId, this.title, this.detail, this.hasCheckList, this.checkList);
    }
}