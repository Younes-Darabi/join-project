import { Injectable, inject } from '@angular/core';
import { Firestore} from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  firestore: Firestore = inject(Firestore);

}
