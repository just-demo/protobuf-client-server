package demo.controller;

import demo.messages.Note;
import demo.messages.NoteForm;
import demo.messages.Notes;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicLong;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.web.cors.CorsConfiguration.ALL;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = ALL)
public class NoteController {
    private Map<Long, Note> notes = new TreeMap<>();
    private AtomicLong idGen = new AtomicLong();

    @GetMapping
    public Notes readAll() {
        return Notes.newBuilder()
                .addAllNotes(notes.values())
                .build();
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public Note create(@RequestBody NoteForm noteForm) {
        long id = idGen.incrementAndGet();
        Note note = Note.newBuilder()
                .setId(id)
                .setText(noteForm.getText())
                .build();
        notes.put(id, note);
        return note;
    }

    @GetMapping("/{id}")
    public Note read(@PathVariable("id") Long id) {
        return notes.get(id);
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable("id") Long id, @RequestBody NoteForm noteForm) {
        Note note = notes.get(id).toBuilder()
                .setText(noteForm.getText())
                .build();
        notes.put(id, note);
        return note;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        notes.remove(id);
    }
}