import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesService {

  constructor(private http: Http) { }

  // Fetch some dummy notes from external API
  // This will be replaced by the link to the backend server api
  getAllNotes() {
    return this.http.get('api/notes')
      .map(res => res.json());
  }

  // Fetch a note with specific ID
  getNote(id: String) {
  	return this.http.get('api/note/' + id)
  		.map(res => res.json());
  }

  // Delete a note with specific ID
  deleteNote(id: String) {
    return this.http.delete('api/note/' + id)
      .map(res => res.json());
  }

  // Save a note with specific ID
  saveNote(id: String, data: Object) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log(data);

    return this.http.put('api/note/' + id, JSON.stringify(data), { headers: headers })
      .map(res => res.json());
  }
}