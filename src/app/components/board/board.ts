import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board/board-service';
import { BoardInterface } from '../../interfaces/board/board.interface';
import { collection, onSnapshot, query } from 'firebase/firestore';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board implements OnInit {
  boardService = inject(BoardService);

  toDoList: BoardInterface[] = [];
  inProgressList: BoardInterface[] = [];
  awaitFeedbackList: BoardInterface[] = [];
  doneList: BoardInterface[] = [];

  ngOnInit() {
    onSnapshot(query(collection(this.boardService.firestore, 'tasks')), (snapshot) => {
      this.toDoList = [];
      this.inProgressList = [];
      this.awaitFeedbackList = [];
      this.doneList = [];

      snapshot.forEach((doc) => {
        const task: BoardInterface = doc.data() as BoardInterface;
        switch (task.status) {
          case 'toDo':
            this.toDoList.push(task);
            break;
          case 'inProgress':
            this.inProgressList.push(task);
            break;
          case 'awaitFeedback':
            this.awaitFeedbackList.push(task);
            break;
          case 'done':
            this.doneList.push(task);
            break;
        }
      });

      console.table(this.toDoList);
      console.table(this.inProgressList);
      console.table(this.awaitFeedbackList);
      console.table(this.doneList);
    });
  }

  drop(event: CdkDragDrop<BoardInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
