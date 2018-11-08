import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArtigoComponent } from './form-artigo.component';

describe('FormArtigoComponent', () => {
  let component: FormArtigoComponent;
  let fixture: ComponentFixture<FormArtigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormArtigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormArtigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
