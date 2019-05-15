const request = require('sync-request');
const messages = require('./generated/messages_pb');

let url = path => 'http://localhost:8080' + path;

// 1 - create
let noteForm = new messages.NoteForm();
noteForm.setText('Test note');
response = request('POST', url('/notes'), {
    headers: {'Content-Type': 'application/x-protobuf'},
    body: Buffer.from(noteForm.serializeBinary())
});
let note = messages.Note.deserializeBinary(response.getBody());
console.log(note.toObject());

// 2 - read
response = request('GET', url('/notes/' + note.getId()));
note = messages.Note.deserializeBinary(response.getBody());
console.log(note.toObject());

// 3 - update
noteForm = new messages.NoteForm();
noteForm.setText('Test note updated');
response = request('PUT', url('/notes/' + note.getId()), {
    headers: {'Content-Type': 'application/x-protobuf'},
    body: Buffer.from(noteForm.serializeBinary())
});
note = messages.Note.deserializeBinary(response.getBody());
console.log(note.toObject());

// 4 - delete
request('DELETE', url('/notes/' + note.getId()));

// 5 - read all
response = request('GET', url('/notes'));
let notes = messages.Notes.deserializeBinary(response.getBody());
console.log(notes.toObject());
