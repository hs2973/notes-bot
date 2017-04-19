import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesService {

  constructor(private http: Http) { }

  // Fetch some dummy notes from external API
  // This will be replaced by the link to the backend server api
  getAllNotes() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts')
      .map(res => res.json());
  }
}