import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NotesService } from '../notes.service';

declare var Quill: any;

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
	note: any;
	quill: any;

  constructor(
  	private notesService: NotesService,
  	private route: ActivatedRoute
  ) { }

  ngOnInit() {
  	this.quill = new Quill('#quill-container', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      scrollingContainer: '#scrolling-container', 
      theme: 'bubble'
    });

  	// Retrive notes form the API
  	// Retrieve notes from the API
    this.route.params
      .switchMap((params: Params) => this.notesService.getNote(params['id']))
      .subscribe(note => {
        this.note = note;

        this.quill.setContents(JSON.parse(this.note.body));
      });
  }

  saveNote(note) {
    var data = {
      body: JSON.stringify(this.quill.getContents()),
      text: this.quill.getText()
    }

    this.notesService.saveNote(note._id, data).subscribe(status => {

        if (status.success === true) {
          alert("Your note was successfully saved.");
        } else {
          alert("Some error occurred. Please try again later.");
        }
      });
  }

}
