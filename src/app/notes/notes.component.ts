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

  deleteNote(note) {
    var res = confirm("Are you sure you want to delete this note: " + note.title + "?");

    if (res === true) {
      console.log("You pressed Ok button");
      this.notesService.deleteNote(note._id).subscribe(status => {

        if (status.success === true) {
          alert("Your note was successfully deleted.");

          location.reload();
        } else {
          alert("Some error occurred. Please try again later.");
        }
      });

    }

  }

}
