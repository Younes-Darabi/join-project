import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './board.html',
  styleUrl: './board.scss',     
})
export class Board { 
  toDoList: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  inProgressList: string[] = ['Item 5', 'Item 6', 'Item 7', 'Item 8'];
  awaitFeedbackList: string[] = ['Item 9', 'Item 10', 'Item 11', 'Item 12'];
  doneList: string[] = ['Item 13', 'Item 14', 'Item 15', 'Item 16'];

  drop(event: CdkDragDrop<string[]>) {
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

