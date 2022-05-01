import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonThirteenComponent } from './lesson-thirteen.component';

describe('LessonThirteenComponent', () => {
  let component: LessonThirteenComponent;
  let fixture: ComponentFixture<LessonThirteenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonThirteenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonThirteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
