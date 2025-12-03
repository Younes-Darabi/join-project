import { Component, inject, ViewChild } from '@angular/core';
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
import { CardDetails } from './card-detail/card-details';
import { CardTask } from './card-task/card-task';
import { AddTask } from "../add-task/add-task";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule, CardDetails, CardTask, AddTask, FormsModule],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board {
  boardService = inject(BoardService);
  searchQuery: string = '';
  tasks: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  @ViewChild(CardDetails) CardDetails!: CardDetails;
  addTaskShow: boolean = false;
  status: string = 'todo';
  searchTerm: string = '';
  isFilterenable: boolean = false;

  filteredLists(searchTerm: string) {
    if (searchTerm.length >= 5) {
      this.boardService.filteredLists(searchTerm);
      this.isFilterenable = true;
    }
  }

  clearFilter() {
    this.searchTerm = '';
    this.isFilterenable = false;
    this.boardService.filteredLists('');
  }

  openTaskDetail(task: TaskInterface) {
    this.CardDetails.showTaskDetail(task);
  }

  taskStatus(status: string) {
    this.status = status;
  }

  filterTasks() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)
    );
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      if (event.container.id === 'todoList') {
        movedItem.status = 'todo';
      } else if (event.container.id === 'inProgressList') {
        movedItem.status = 'in-progress';
      } else if (event.container.id === 'awaitFeedbackList') {
        movedItem.status = 'await-feedback';
      } else {
        movedItem.status = 'done';
      }
      this.boardService.updateTaskInFirebase(movedItem);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
