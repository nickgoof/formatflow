import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelComponent } from './pixel-component';

describe('PixelComponent', () => {
  let component: PixelComponent;
  let fixture: ComponentFixture<PixelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
