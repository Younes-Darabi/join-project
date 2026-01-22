import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { BoardService } from '../../../../services/board/board-service';
import { TaskInterface } from '../../../../interfaces/board/task.interface';
import { NgIf } from '@angular/common';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../../services/contact/contact-service';

/**
 * Component for editing task details
 * Provides comprehensive task editing including assignments, subtasks, and priority
 * Handles contact selection and real-time updates to Firebase
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './card-edit.html',
  styleUrl: './card-edit.scss',
})
export class CardEdit {
  /** Board service for task operations */
  boardService = inject(BoardService);
  
  /** Contact service for retrieving contact information */
  contactService = inject(ContactService);
  
  /** Search term for filtering contacts */
  search: string = '';
  
  /** Array of selected contacts for task assignment */
  selected: ContactInterface[] = [];
  
  /** List of all tasks */
  taskList: TaskInterface[] = [];
  
  /** List of all contacts */
  contactList: ContactInterface[] = [];
  
  /** Flag to control assigned contacts dropdown visibility */
  open: boolean = false;
  
  /** Confirmation message after save */
  confirmationMessage: string = '';
  
  /** Input field value for subtask */
  subtaskInput: string = '';
  
  /** Edited copy of subtasks */
  editedSubtasks: { title: string; completed: boolean }[] = [];
  
  /** Change detector reference for manual change detection */
  cdr = inject(ChangeDetectorRef);

  /** Task object being edited */
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

  /**
   * Shows edit dialog with task details
   * @param task - Task to edit
   */
  showEditDetail(task: TaskInterface) {
    this.task = task;
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

  /** Event emitter for closing the edit dialog */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /** Event emitter for saving task changes */
  @Output() saveChangesEvent = new EventEmitter<TaskInterface>();

  /** The task being edited from parent component */
  @Input() item?: TaskInterface;
  
  /** Editable copy of the task */
  editedItem!: TaskInterface;
  
  /** Flag indicating if dialog is open */
  isDialogOpen: boolean = false;
  
  /** Currently selected priority level */
  selectedPriority: string = 'medium';
  
  /** Timeout for hiding input icons */
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  
  /** Flag indicating if subtask input is focused */
  subtaskInputFocused: boolean = false;
  
  /** Array of subtasks with edit state */
  subtasks: { name: string; isEditing: boolean }[] = [];
  
  /** Flag to control dropdown visibility */
  dropdownVisible: boolean = false;
  
  /** Flag indicating if edit form was submitted */
  isEditFormSubmitted: boolean = false;
  
  /** New date value for task */
  newDate: string = '';
  
  /** Flag to control category dropdown visibility */
  categoryDropdownOpen: boolean = false;
  
  /** Current user email for identifying "You" in contact list */
  yourEmail: string = 'deine@email.de';

  /**
   * Initializes component
   * Loads contacts and sets up selected contacts for task
   */
  async ngOnInit() {
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase();
    }
    this.contactList = this.sortContactsAlphabetically(this.contactService.contactList);
    this.setIsYouForContacts();
    if (this.item) {
      this.selected = this.contactList.filter(
        (contact) => contact.id !== undefined && this.item!.assignedTo.includes(contact.id)
      );
    }
  }

  /**
   * Responds to input changes
   * Updates task copy and selected contacts when item changes
   */
  ngOnChanges() {
    if (this.item) {
      this.task = JSON.parse(JSON.stringify(this.item));
      this.editedSubtasks = [...this.task.subTasks];
      this.selected = this.contactList.filter(
        (contact) => contact.id !== undefined && this.task.assignedTo.includes(contact.id)
      );
    }
  }

  /**
   * Saves all task changes to Firebase
   * Updates assigned contacts and subtasks, then closes dialog
   */
  saveChanges() {
    if (!this.task) return;

    this.task.assignedTo = this.selected
      .map((c) => c.id)
      .filter((id): id is string => id !== undefined);

    this.task.subTasks = [...this.editedSubtasks];
    this.boardService.updateTaskInFirebase(this.task);
    this.saveChangesEvent.emit(this.task);
    this.closeDialogEvent.emit();
  }

  /**
   * Sets the priority level for the task
   * @param priority - Priority level to set
   */
  selectPriority(priority: string) {
    this.selectedPriority = priority;
    this.task.priority = priority;
  }

  /**
   * Closes the edit dialog
   * Emits close event to parent component
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }

  /**
   * Stops event propagation
   * @param event - Event to stop
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Clears subtask input field and unfocuses
   */
  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

  /**
   * Focuses the subtask input element
   */
  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

  /**
   * Handles subtask input blur event
   * Delays hiding input icons
   */
  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 500);
  }

  /**
   * Handles subtask input focus event
   * Cancels hiding timeout and shows input icons
   */
  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
  }

  /**
   * Marks current user's contact with isYou flag
   * Compares contact emails with yourEmail property
   */
  setIsYouForContacts() {
    this.contactList = this.contactList.map((contact) => ({
      ...contact,
      isYou: contact.email === this.yourEmail,
    }));
  }

  /**
   * Sorts contacts alphabetically by name
   * @param contact - Array of contacts to sort
   * @returns Sorted contact array
   */
  sortContactsAlphabetically(contact: ContactInterface[]) {
    return this.contactService.sortContacts(contact);
  }

  /**
   * Toggles assigned contacts dropdown visibility
   * @param event - Mouse event to stop propagation
   */
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.open = !this.open;
  }

  /**
   * Toggles contact selection for task assignment
   * Adds or removes contact from selected array
   * @param contact - Contact to toggle
   */
  toggleSelect(contact: ContactInterface) {
    let exists = this.selected.some((u) => u.id === contact.id);
    if (exists) {
      this.selected = this.selected.filter((u) => u.id !== contact.id);
    } else {
      this.selected = [...this.selected, contact];
    }
    this.cdr.detectChanges();
  }

  /**
   * Checks if contact is currently selected
   * @param contact - Contact to check
   * @returns True if contact is selected
   */
  isContactSelected(contact: ContactInterface): boolean {
    return this.selected.some((selectedContact) => selectedContact.id === contact.id);
  }

  /**
   * Returns CSS class for dropdown item based on selection state
   * @param contact - Contact for the dropdown item
   * @returns CSS class name
   */
  getDropdownItemClass(contact: ContactInterface): string {
    return this.isContactSelected(contact) ? 'assigned_dropdown_item_active' : '';
  }

  /**
   * Closes all dropdowns when clicking outside
   * Global document click listener
   */
  @HostListener('document:click')
  closeDropdowns() {
    this.open = false;
    this.categoryDropdownOpen = false;
  }

  /**
   * Saves subtasks to Firebase instantly
   * Updates task with current edited subtasks
   */
  private saveSubtasksInstantly() {
    this.task.subTasks = [...this.editedSubtasks];
    this.boardService.updateTaskInFirebase(this.task);
  }

  /**
   * Adds a new subtask to the task
   * Clears input after adding
   */
  addSubtask() {
    if (!this.subtaskInput.trim()) return;

    this.editedSubtasks.push({
      title: this.subtaskInput.trim(),
      completed: false,
    });

    this.subtaskInput = '';
  }

  /**
   * Toggles subtask completion status
   * @param index - Index of subtask to toggle
   */
  toggleSubtask(index: number) {
    this.editedSubtasks[index].completed = !this.editedSubtasks[index].completed;
  }

  /**
   * Deletes a subtask from the list
   * Saves changes instantly to Firebase
   * @param index - Index of subtask to delete
   */
  deleteSubtask(index: number) {
    this.editedSubtasks.splice(index, 1);
    this.saveSubtasksInstantly();
  }

  /**
   * Retrieves contact details by contact ID
   * @param id - Contact ID to search for
   * @returns Contact object if found, undefined otherwise
   */
  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find((contact) => contact.id === id);
  }
}
