package self.ed.client;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.HttpClients;
import self.ed.messages.Note;
import self.ed.messages.NoteForm;
import self.ed.messages.Notes;

import static org.apache.http.HttpHeaders.CONTENT_TYPE;

public class NoteClient {
    private static final String BASE_URL = "http://localhost:8080";

    public static void main(String[] args) throws Exception {
        HttpClient httpClient = HttpClients.createDefault();

        // 1 - create
        NoteForm noteForm = NoteForm.newBuilder()
                .setText("Test note")
                .build();
        HttpPost httpPost = new HttpPost(url("/notes"));
        httpPost.setHeader(CONTENT_TYPE, "application/x-protobuf");
        httpPost.setEntity(new ByteArrayEntity(noteForm.toByteArray()));
        HttpResponse httpResponse = httpClient.execute(httpPost);
        Note note = Note.parseFrom(httpResponse.getEntity().getContent());
        System.out.println(note);

        // 2 - read
        HttpGet httpGet = new HttpGet(url("/notes/" + note.getId()));
        httpResponse = httpClient.execute(httpGet);
        note = Note.parseFrom(httpResponse.getEntity().getContent());
        System.out.println(note);

        // 3 - update
        noteForm = NoteForm.newBuilder()
                .setText("Test note updated")
                .build();
        HttpPut httpPut = new HttpPut(url("/notes/" + note.getId()));
        httpPut.setHeader(CONTENT_TYPE, "application/x-protobuf");
        httpPut.setEntity(new ByteArrayEntity(noteForm.toByteArray()));
        httpResponse = httpClient.execute(httpPut);
        note = Note.parseFrom(httpResponse.getEntity().getContent());
        System.out.println(note);

        // 4 - delete
        HttpDelete httpDelete = new HttpDelete(url("/notes/" + note.getId()));
        httpClient.execute(httpDelete);

        // 5 - read all
        httpGet = new HttpGet(url("/notes"));
        httpResponse = httpClient.execute(httpGet);
        Notes notes = Notes.parseFrom(httpResponse.getEntity().getContent());
        System.out.println(notes);
    }

    private static String url(String path) {
        return BASE_URL + path;
    }
}
