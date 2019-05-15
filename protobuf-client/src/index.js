const {createElement} = require('react');
const {render} = require('react-dom');
const createReactClass = require('create-react-class');
const messages = require('../generated/messages_pb');

let url = path => 'http://localhost:8080' + path;

render(createElement(createReactClass({
    getInitialState() {
        return {
            text: '',
            notes: [],
        };
    },

    componentDidMount() {
        fetch(url('/notes'))
            .then(notes => notes.arrayBuffer())
            .then(notes => messages.Notes.deserializeBinary(notes))
            .then(notes => this.setState({notes: notes.getNotesList()}));
    },

    createNote() {
        const noteForm = new messages.NoteForm();
        noteForm.setText(this.state.text.trim());
        fetch(url('/notes'), {
            method: 'POST',
            headers: {'Content-Type': 'application/x-protobuf'},
            // body: Buffer.from(noteForm.serializeBinary())
            body: noteForm.serializeBinary()
        }).then(note => note.arrayBuffer())
            .then(note => messages.Note.deserializeBinary(note))
            .then(note => this.setState({
                text: '',
                notes: [...this.state.notes, note]
            }));
    },

    deleteNote(noteId) {
        fetch(url('/notes/' + noteId), {method: 'DELETE'})
            .then(() => this.setState({
                notes: this.state.notes.filter(note => note.getId() !== noteId)
            }));
    },

    render() {
        return createElement('table', null,
            createElement('tbody', null,
                createElement('tr', null,
                    createElement('th', null,
                        createElement('input', {
                            value: this.state.text,
                            onChange: e => this.setState({text: e.target.value})
                        })
                    ),
                    createElement('th', null,
                        createElement('button', {
                            onClick: () => this.createNote()
                        }, 'Create'),
                    )
                ),
                this.state.notes.map(note => createElement('tr', {key: note.getId()},
                    createElement('td', null, note.getText()),
                    createElement('td', null,
                        createElement('button', {
                            onClick: () => this.deleteNote(note.getId())
                        }, 'Delete'),
                    )
                ))
            )
        );
    }
})), document.getElementById('root'));