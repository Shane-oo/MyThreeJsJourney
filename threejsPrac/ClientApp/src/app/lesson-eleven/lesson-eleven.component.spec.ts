import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonElevenComponent } from './lesson-eleven.component';

describe('LessonElevenComponent', () => {
  let component: LessonElevenComponent;
  let fixture: ComponentFixture<LessonElevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonElevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonElevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
