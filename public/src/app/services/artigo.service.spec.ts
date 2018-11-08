import { TestBed, inject } from '@angular/core/testing';

import { ArtigoService } from './artigo.service';

describe('ArtigoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtigoService]
    });
  });

  it('should be created', inject([ArtigoService], (service: ArtigoService) => {
    expect(service).toBeTruthy();
  }));
});
