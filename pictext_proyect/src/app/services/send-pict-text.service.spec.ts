import { TestBed } from '@angular/core/testing';

import { SendPictTextService } from './send-pict-text.service';

describe('SendPictTextService', () => {
  let service: SendPictTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendPictTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
