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
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../../../services/board/board-service';
import { TaskInterface } from '../../../../interfaces/board/task.interface';
import { NgIf } from '@angular/common';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../../services/contact/contact-service';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  boardService = inject(BoardService);
  contactService = inject(ContactService);
  search: string = '';
  selected: ContactInterface[] = [];
  taskList: TaskInterface[] = [];
  contactList: ContactInterface[] = [];
  open: boolean = false;
  confirmationMessage: string = '';
  subtaskInput: string = '';
  editedSubtasks: { title: string; completed: boolean }[] = [];

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
  subtasks: { name: string; isEditing: boolean }[] = [];
  dropdownVisible: boolean = false;
  isEditFormSubmitted: boolean = false;
  newDate: string = '';
  categoryDropdownOpen: boolean = false;
  yourEmail: string = 'deine@email.de';

  async ngOnInit() {
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase(); // Diese Methode muss im Service existieren!
    }
    this.contactList = this.sortContactsAlphabetically(this.contactService.contactList);
    this.setIsYouForContacts();
  }

  ngOnChanges() {
    if (this.item) {
      this.task = JSON.parse(JSON.stringify(this.item));
      this.editedSubtasks = [...this.task.subTasks];
      this.selectedPriority = this.task.priority || 'medium';
      this.selected = this.contactList.filter(
        (contact) => contact.id !== undefined && this.task.assignedTo.includes(contact.id)
      );
    }
  }

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

  setIsYouForContacts() {
    this.contactList = this.contactList.map((contact) => ({
      ...contact,
      isYou: contact.email === this.yourEmail,
    }));
  }

  sortContactsAlphabetically(contact: ContactInterface[]) {
    return this.contactService.sortContacts(contact);
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.open = !this.open;
  }

  toggleSelect(contact: ContactInterface) {
    let exists = this.selected.some((u) => u.id === contact.id);
    if (exists) {
      this.selected = this.selected.filter((u) => u.id !== contact.id);
    } else {
      this.selected = [...this.selected, contact];
    }
  }

  isContactSelected(contact: ContactInterface): boolean {
    return this.selected.some((selectedContact) => selectedContact.id === contact.id);
  }

  getDropdownItemClass(contact: ContactInterface): string {
    return this.isContactSelected(contact) ? 'assigned_dropdown_item_active' : '';
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.open = false;
    this.categoryDropdownOpen = false;
  }

  private saveSubtasksInstantly() {
    this.task.subTasks = [...this.editedSubtasks];
    this.boardService.updateTaskInFirebase(this.task);
  }

  addSubtask() {
    if (!this.subtaskInput.trim()) return;

    this.editedSubtasks.push({
      title: this.subtaskInput.trim(),
      completed: false,
    });

    this.subtaskInput = '';
    this.saveSubtasksInstantly();
  }

  toggleSubtask(index: number) {
    this.editedSubtasks[index].completed = !this.editedSubtasks[index].completed;
    this.saveSubtasksInstantly();
  }

  deleteSubtask(index: number) {
    this.editedSubtasks.splice(index, 1);
    this.saveSubtasksInstantly();
  }
}
