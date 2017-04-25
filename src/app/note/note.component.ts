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

        this.quill.setText(this.note.body);
      });
  }

}
