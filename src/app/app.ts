import { Component } from '@angular/core';
import { DocSummarizerComponent } from './components/doc-summarizer/doc-summarizer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DocSummarizerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
