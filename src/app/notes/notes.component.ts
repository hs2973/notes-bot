import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
	// instantiate posts to an empty array
  notes: any = [];

  constructor(private notesService: NotesService) { }

  ngOnInit() {
  	// Retrieve notes from the API
    this.notesService.getAllNotes().subscribe(notes => {
      this.notes = notes;
    });
  }

}
