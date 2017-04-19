import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Import app components
import { AppComponent } from './app.component';
import { NotesComponent } from './notes/notes.component';

// Import app services
import { NotesService } from './notes.service';


// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: NotesComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [NotesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
