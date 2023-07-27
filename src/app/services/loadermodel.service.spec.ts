import { TestBed } from '@angular/core/testing';

import { LoadermodelService } from './loadermodel.service';

describe('LoadermodelService', () => {
  let service: LoadermodelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadermodelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
