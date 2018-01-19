import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotehomeComponent } from './votehome.component';

describe('VotehomeComponent', () => {
  let component: VotehomeComponent;
  let fixture: ComponentFixture<VotehomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotehomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotehomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
