import { TestBed } from '@angular/core/testing';

import { SendCloudinaryService } from './send-cloudinary.service';

describe('SendCloudinaryService', () => {
  let service: SendCloudinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendCloudinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
