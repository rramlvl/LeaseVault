import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DocSummarizerService } from './doc-summarizer.service';

describe('DocSummarizerService', () => {
  let service: DocSummarizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DocSummarizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
