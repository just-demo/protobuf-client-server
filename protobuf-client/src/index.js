const React = require('react');
const ReactDOM = require('react-dom');
const createReactClass = require('create-react-class');
const messages = require('../generated/messages_pb');

let url = path => 'http://localhost:8080' + path;

let App = createReactClass({
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
        return React.createElement('table', null,
            React.createElement('tbody', null,
                React.createElement('tr', null,
                    React.createElement('th', null,
                        React.createElement('input', {
                            value: this.state.text,
                            onChange: e => this.setState({text: e.target.value})
                        })
                    ),
                    React.createElement('th', null,
                        React.createElement('button', {
                            onClick: () => this.createNote()
                        }, 'Create'),
                    )
                ),
                this.state.notes.map(note => React.createElement('tr', {key: note.getId()},
                    React.createElement('td', null, note.getText()),
                    React.createElement('td', null,
                        React.createElement('button', {
                            onClick: () => this.deleteNote(note.getId())
                        }, 'Delete'),
                    )
                ))
            )
        );
    }
});


ReactDOM.render(React.createElement(App), document.getElementById('root'));