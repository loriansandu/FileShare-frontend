import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePanelComponent } from './file-panel.component';

describe('FilePanelComponent', () => {
  let component: FilePanelComponent;
  let fixture: ComponentFixture<FilePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilePanelComponent]
    });
    fixture = TestBed.createComponent(FilePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
