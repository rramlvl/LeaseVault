import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DocSummarizerComponent } from './doc-summarizer.component';

describe('DocSummarizerComponent', () => {
  let component: DocSummarizerComponent;
  let fixture: ComponentFixture<DocSummarizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocSummarizerComponent],
      imports: [FormsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DocSummarizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
