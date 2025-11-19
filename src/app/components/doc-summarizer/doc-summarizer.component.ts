import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocSummarizerService } from '../../services/doc-summarizer.service';

@Component({
  selector: 'app-doc-summarizer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doc-summarizer.component.html',
  styleUrls: ['./doc-summarizer.component.css']
})
export class DocSummarizerComponent {
  selectedFile: File | null = null;
  prompt = 'Summarize this document in 5 bullet points.';
  summary = '';
  loading = false;
  error = '';

  constructor(private summarizer: DocSummarizerService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  run() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.summary = '';
    this.error = '';

    this.summarizer.summarizeFile(this.selectedFile, this.prompt).subscribe({
      next: (res) => {
        this.loading = false;
        this.summary = res.summary;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Summarization failed.';
        console.error(err);
      }
    });
  }
}
