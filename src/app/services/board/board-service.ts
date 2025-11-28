import { inject, Injectable, OnDestroy } from '@angular/core';
import { Firestore, onSnapshot, query, collection } from '@angular/fire/firestore';
import { BoardInterface } from '../../interfaces/board/board.interface';

@Injectable({
  providedIn: 'root'
})

export class BoardService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  unsubTasks;
  tasks: BoardInterface[] = [];

  constructor() {
    this.unsubTasks = onSnapshot(query(collection(this.firestore, 'tasks')), (snapshot) => {
      this.tasks = [];
      snapshot.forEach((doc) => {
        this.tasks.push(doc.data() as BoardInterface);
        console.log(doc.data());
      });
      //hier logik fürs sortieren
    });
  }

  // funktion fürs sortieren
  ngOnDestroy() {
    if (this.unsubTasks) {
      this.unsubTasks();
    }
  }
}