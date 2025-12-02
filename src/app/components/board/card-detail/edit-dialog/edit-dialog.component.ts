import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../../../services/board/board-service';
import { TaskInterface } from '../../../../interfaces/board/task.interface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  boardService = inject(BoardService);

  task: TaskInterface = {
    id: '',
    title: '',
    description: '',
    assignedTo: [],
    dueDate: new Date(),
    status: 'todo',
    priority: '',
    taskCategory: 'User Story',
    subTasks: [],
  };

  showEditDetail(task: TaskInterface) {
    this.task = task;
  }

  /**
   * @event closeDialogEvent
   * Emits an event when the edit dialog should be closed.
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * @event saveChangesEvent
   * Emits an event when task changes are saved.
   */
  @Output() saveChangesEvent = new EventEmitter<TaskInterface>();

  /**
   * @property {TaskInterface | undefined} item
   * The task being edited.
   */
  @Input() item?: TaskInterface;
  editedItem!: TaskInterface;
  isDialogOpen: boolean = false;
  selectedPriority: string = 'medium';
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  subtaskInputFocused: boolean = false;
  subtaskInput: string = '';
  subtasks: { name: string; isEditing: boolean }[] = [];
  dropdownVisible: boolean = false;
  isEditFormSubmitted: boolean = false;
  newDate: string = '';

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.item) {
      this.task = JSON.parse(JSON.stringify(this.item));
      this.selectedPriority = this.task.priority || 'medium';
    }
  }

  saveChanges() {
    if (!this.task) return;
    this.boardService.updateTaskInFirebase(this.task);
    this.saveChangesEvent.emit(this.task);
    this.closeDialogEvent.emit();
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    this.task.priority = priority;
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 500);
  }

  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
  }

  onSelectContactsClick(event: Event) {
    event.stopPropagation();
    this.toggleDropdown();
  }
}
