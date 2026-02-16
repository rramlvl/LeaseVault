import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocSummarizerService } from '../../services/doc-summarizer.service';
import { FirestoreService } from '../../firebase/firestore.service';
import { LEASE_SUMMARY_PROMPT } from '../../prompts/lease-summary.prompt';

@Component({
  selector: 'app-doc-summarizer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doc-summarizer.component.html',
  styleUrls: ['./doc-summarizer.component.css']
})
export class DocSummarizerComponent {
  selectedFile: File | null = null;
  prompt = LEASE_SUMMARY_PROMPT;
  summary = '';
  loading = false;
  error = '';

  constructor(private summarizer: DocSummarizerService, private vault: FirestoreService) {}

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
    next: async (res) => {
      this.loading = false;
      this.summary = res.summary;

      // ✅ Save to Firestore for this user
      try {
        await this.vault.saveSummary(this.selectedFile!, this.summary);
      } catch (e) {
        console.warn('Failed to save summary to Firestore:', e);
        // Do not block the user if saving fails
      }
    },
    error: (err) => {
      this.loading = false;
      this.error = 'Summarization failed.';
      console.error(err);
    }
  });
}
}
