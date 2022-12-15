import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonThirtyTwoComponent } from './lesson-thirty-two.component';

describe('LessonThirtyTwoComponent', () => {
  let component: LessonThirtyTwoComponent;
  let fixture: ComponentFixture<LessonThirtyTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonThirtyTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonThirtyTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
