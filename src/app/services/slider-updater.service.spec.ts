import { TestBed } from '@angular/core/testing';

import { SliderUpdaterService } from './slider-updater.service';

describe('SliderUpdaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SliderUpdaterService = TestBed.get(SliderUpdaterService);
    expect(service).toBeTruthy();
  });
});
