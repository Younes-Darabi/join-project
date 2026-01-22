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

/**
 * Component for managing the Kanban board view
 * Displays tasks organized by status columns with drag-and-drop functionality
 * Provides search and filter capabilities for tasks
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule, CardDetails, CardTask, AddTask, FormsModule],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board {
  /** Board service for task operations and data management */
  boardService = inject(BoardService);
  
  /** Search query string for filtering tasks */
  searchQuery: string = '';
  
  /** List of all tasks */
  tasks: TaskInterface[] = [];
  
  /** Filtered list of tasks based on search criteria */
  filteredTasks: TaskInterface[] = [];
  
  /** Reference to CardDetails child component */
  @ViewChild(CardDetails) CardDetails!: CardDetails;
  
  /** Flag to control add task modal visibility */
  addTaskShow: boolean = false;
  
  /** Status for new tasks being created */
  status: string = 'todo';
  
  /** Current search term for filtering */
  searchTerm: string = '';
  
  /** Flag indicating if filter is active */
  isFilterenable: boolean = false;

  /**
   * Filters task lists based on search term
   * Enables filter mode when search term is provided
   * @param searchTerm - Search term to filter tasks by
   */
  filteredLists(searchTerm: string) {
    // if (searchTerm.length >= 3) {
      this.boardService.filteredLists(searchTerm);
      this.isFilterenable = true;
    // }
  }

  /**
   * Clears the current filter
   * Resets search term and disables filter mode
   */
  clearFilter() {
    this.searchTerm = '';
    this.isFilterenable = false;
    this.boardService.filteredLists('');
  }

  /**
   * Opens task detail modal for the selected task
   * @param task - Task to display in detail view
   */
  openTaskDetail(task: TaskInterface) {
    this.CardDetails.showTaskDetail(task);
  }

  /**
   * Sets the status for new tasks to be created
   * @param status - Status value to set
   */
  taskStatus(status: string) {
    this.status = status;
  }

  /**
   * Handles drag and drop events for task cards
   * Updates task status when moved to different columns
   * Persists changes to Firebase
   * @param event - CDK drag drop event containing source and target containers
   */
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
