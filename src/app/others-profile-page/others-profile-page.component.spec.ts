import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersProfilePageComponent } from './others-profile-page.component';

describe('OthersProfilePageComponent', () => {
  let component: OthersProfilePageComponent;
  let fixture: ComponentFixture<OthersProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
