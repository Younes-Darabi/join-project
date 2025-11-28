import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board/board-service';
import { TaskInterface } from '../../interfaces/board/task.interface';
import { CardComponent } from "./card/card.component";

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule, CardComponent],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board {
  boardService = inject(BoardService);
  @ViewChild(CardComponent) CardComponent!: CardComponent;
  
  openTaskDetail(task: TaskInterface) {
    this.CardComponent.showTaskDetail(task);
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
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
