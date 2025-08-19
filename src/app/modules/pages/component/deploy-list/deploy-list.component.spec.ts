import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployListComponent } from './deploy-list.component';

describe('DeployListComponent', () => {
  let component: DeployListComponent;
  let fixture: ComponentFixture<DeployListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeployListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeployListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
