import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFiveComponent } from './lesson-five.component';

describe('LessonFiveComponent', () => {
  let component: LessonFiveComponent;
  let fixture: ComponentFixture<LessonFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
