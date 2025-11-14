import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

describe('Firestore', () => {
  let service: Firestore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Firestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
