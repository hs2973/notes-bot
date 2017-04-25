import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
}