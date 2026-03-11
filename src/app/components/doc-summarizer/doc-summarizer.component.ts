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
  consentChecked = false;

  constructor(private summarizer: DocSummarizerService, private vault: FirestoreService) {}

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files && input.files.length > 0 ? input.files[0] : null;

  this.error = '';
  this.selectedFile = null;

  if (!file) return;

  // PDF only
  if (file.type !== 'application/pdf') {
    this.error = 'Please select a PDF file only.';
    input.value = ''; // clears the file picker
    return;
  }

  // 10 MB limit
  const max = 10 * 1024 * 1024;
  if (file.size > max) {
    this.error = 'PDF is too large (max 10 MB).';
    input.value = '';
    return;
  }

  this.selectedFile = file;
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

      //  Save to Firestore for this user
      try {
        await this.vault.saveSummary(this.selectedFile!, this.summary);
        } catch (e) {
        const err = e as any;
        console.error('Save failed:', err?.code, err?.message, err);
        this.error = `Save failed: ${err?.code ?? ''} ${err?.message ?? err}`;
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
