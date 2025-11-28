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
import { TaskInterface } from '../../interfaces/board/task.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CardComponent } from './card/card.component';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule, CardComponent, TaskCardComponent],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board {
  boardService = inject(BoardService);
  selectedItem!: TaskInterface;
  isDialogOpen: boolean = false;
  isAddDialogOpen: boolean = false;

  show() {
    console.log(this.boardService.taskList);
  }

  openCardDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
    this.toggle();
  }

  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');
    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
    }
  }

  receiveEmitFromDialog(dialogClosed: boolean) {
    this.isAddDialogOpen = false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  toggle() {
    const board = document.getElementById('board') as HTMLElement | null;
    if (!board) return;
    board.style.display = board.style.display === 'none' ? '' : 'none';
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
