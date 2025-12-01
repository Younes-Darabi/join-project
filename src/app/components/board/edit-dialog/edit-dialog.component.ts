import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  firebase = inject(BoardService);
  

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

  /** Stores a copy of the task being edited */
  editedItem!: TaskInterface;

  /** Controls dialog visibility */
  isDialogOpen: boolean = false;

  /** Selected priority level */
  selectedPriority: string = 'medium';

  /** Timeout reference for hiding input icon */
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Tracks focus state of the subtask input field */
  subtaskInputFocused: boolean = false;

  /** Input field for new subtasks */
  subtaskInput: string = '';

  /** Stores the list of subtasks */
  subtasks: { name: string; isEditing: boolean }[] = [];

  /** Controls the dropdown menu visibility */
  dropdownVisible: boolean = false;

  /** Tracks form submission state */
  isEditFormSubmitted: boolean = false;

  /** Stores the selected date */
  newDate: string = '';

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  ngOnInit() {
    this.editedItem = JSON.parse(JSON.stringify(this.item)) || {};
    if (this.item?.priority) {
      this.selectedPriority = this.item.priority;
    }
  }

  saveChanges() {
    this.saveChangesEvent.emit(this.editedItem);
    this.closeDialog();
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    if (this.editedItem) {
      this.editedItem.priority = priority;
    }
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
}
