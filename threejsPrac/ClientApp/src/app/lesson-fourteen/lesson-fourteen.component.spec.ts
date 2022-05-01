import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFourteenComponent } from './lesson-fourteen.component';

describe('LessonFourteenComponent', () => {
  let component: LessonFourteenComponent;
  let fixture: ComponentFixture<LessonFourteenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonFourteenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonFourteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
