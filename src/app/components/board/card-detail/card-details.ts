import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, inject, ViewChild } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../services/contact/contact-service';
import { CardEdit } from './card-edit/card-edit';

/**
 * Component for displaying task card details in a modal view
 * Shows complete task information including subtasks and assigned contacts
 * Provides access to edit mode for task modification
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-card-details',
  imports: [CommonModule, CardEdit],
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
})
export class CardDetails {
  /** Board service for task operations */
  boardService = inject(BoardService);

  /** Contact service for retrieving contact information */
  contactService = inject(ContactService);

  /** Controls component display visibility */
  @HostBinding('style.display') display = 'none';

  /** Current task being displayed */
  task: TaskInterface = {
    id: '',
    title: '',
    description: '',
    assignedTo: [],
    dueDate: null,
    status: 'todo',
    priority: '',
    taskCategory: 'User Story',
    subTasks: [],
  };

  /** Flag to control edit mode visibility */
  editPageShow: boolean = false;

  /** Temporary copy of subtasks for editing */
  editSubtasks: TaskInterface['subTasks'] = [];

  /** Reference to host element for CSS class manipulation */
  hostElement = inject(ElementRef);

  /** Reference to CardEdit child component */
  @ViewChild(CardEdit) CardEdit!: CardEdit;

  /**
   * Closes the task detail modal
   * Hides display and removes show CSS class
   */
  closeTaskDetail() {
    this.display = 'none';
    this.hostElement.nativeElement.classList.remove('show');
  }

  /**
   * Opens edit mode for the current task
   * Delegates to CardEdit component
   * @param task - Task to be edited
   */
  openEditDetail(task: TaskInterface) {
    this.editPageShow = true;
    this.CardEdit.showEditDetail(task);
  }

  /**
   * Shows task detail modal with task information
   * Creates a copy of subtasks and displays the component
   * @param task - Task to display
   */
  showTaskDetail(task: TaskInterface) {
    this.task = task;
    this.editSubtasks = task.subTasks.map((sub) => ({ ...sub }));
    this.display = 'flex';
    this.hostElement.nativeElement.classList.add('show');
  }

  /**
   * Handles task save event from edit component
   * Updates local task and board service task list
   * @param updatedTask - Updated task object from edit component
   */
  onTaskSaved(updatedTask: TaskInterface) {
    this.task = { ...updatedTask };
    const index = this.boardService.taskList.findIndex((t) => t.id === updatedTask.id);
    if (index > -1) {
      this.boardService.taskList[index] = updatedTask;
    }
    this.boardService.sortTasksByStatus();
  }

  /**
   * Retrieves contact details by contact ID
   * @param id - Contact ID to search for
   * @returns Contact object if found, undefined otherwise
   */
  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find((contact) => contact.id === id);
  }

  /**
   * Toggles subtask completion status
   * Updates task in Firebase after toggle
   * @param task - Task containing the subtask
   * @param index - Index of subtask to toggle
   */
  toggleSubTask(task: TaskInterface, index: number) {
    task.subTasks[index].completed = !task.subTasks[index].completed;
    this.boardService.updateTaskInFirebase(this.task);
  }
}
