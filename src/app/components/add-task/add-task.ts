import { Component, inject, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact-service';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { NgClass } from '@angular/common';
import { TaskInterface } from '../../interfaces/board/task.interface';
import { BoardService } from '../../services/board/board-service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

/**
 * Component for adding new tasks to the board
 * Handles task creation, assignment of contacts, subtasks, and form validation
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-add-task',
  imports: [FormsModule, NgClass],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.scss'],
})
export class AddTask {
  /**
   * Initial status for the new task
   */
  @Input() status!:string;

  /** Router service for navigation */
  router: Router = inject(Router);
  
  /** Board service for task operations */
  boardService = inject(BoardService);
  
  /** Contact service for managing contacts */
  contactService = inject(ContactService);
  
  /** List of all tasks */
  taskList: TaskInterface[] = [];
  
  /** List of all contacts */
  contactList: ContactInterface[] = [];
  
  /** Search term for filtering contacts */
  search: string = '';
  
  /** Flag to control assigned contacts dropdown visibility */
  open: boolean = false;
  
  /** Array of selected contacts for task assignment */
  selected: ContactInterface[] = [];
  
  /** Success message shown after task creation */
  confirmationMessage: string = '';
  
  /** Error message for validation issues */
  errorMessage: string = '';
  
  /** Flag indicating if form has been submitted */
  formSubmitted: boolean = false;
  
  /** Flag to control category dropdown visibility */
  categoryDropdownOpen: boolean = false;
  
  /** Available task categories */
  categoryOptions: TaskInterface['taskCategory'][] = ['User Story', 'Technical Task'];
  
  /** Current user email for identifying "You" in contact list */
  yourEmail: string = 'deine@email.de';

  /** New task object being created */
  newTask: TaskInterface = {
    id: '',
    title: '',
    description: '',
    assignedTo: [],
    dueDate: null,
    status: 'todo',
    priority: 'medium',
    taskCategory: '',
    subTasks: [] as { title: string; completed: boolean }[]
  };
  
  /** Input field value for subtask */
  subtaskInput: string = '';
  
  /** Index of subtask being edited, null if creating new */
  subtaskEditIndex: number | null = null;
  
  /**
   * Checks if subtask input has content
   * @returns True if subtask input is not empty
   */
  hasSubtaskInput(): boolean {
    return this.subtaskInput.trim().length > 0;
  }

  /**
   * Determines CSS class for assigned dropdown based on state
   * @returns CSS class name for dropdown styling
   */
  getAssignedDropdownClass(): string {
    if (this.open) {
      return 'has_dropdown_open';
    }
    if (this.selected.length > 0) {
      return 'has_selected_avatars';
    }
    return '';
  }

  /**
   * Determines CSS class for category dropdown based on state
   * @returns CSS class name for category dropdown
   */
  getCategoryDropdownClass(): string {
    let classes = 'category_dropdown';
    if (this.categoryDropdownOpen) {
      classes += ' has_dropdown_open';
    }
    return classes;
  }

  /**
   * Saves the task to Firebase after validation
   * Assigns selected contacts, resets form, and navigates to board
   * @param task - Task object to be saved
   */
  async saveTask(task: TaskInterface) {
    this.formSubmitted = true;
    if (!task.title || !task.dueDate || !task.taskCategory) {
      return;
    }
    task.assignedTo = this.selected
      .map(contact => contact.id)
      .filter((id): id is string => typeof id === 'string' && !!id);

    await this.boardService.addTask(task);
    this.resetForm();
    this.showConfirmation('Task added to board');
    this.changeToBoard();
    this.formSubmitted = false;
  }

  /**
   * Resets the task form to initial state
   * Clears all input fields and selections
   */
  resetForm() {
    this.newTask = {
      id: '',
      title: '',
      description: '',
      assignedTo: [],
      dueDate: null,
      status: 'todo',
      priority: 'medium',
      taskCategory: '',
      subTasks: [] as { title: string; completed: boolean }[]
    };
    this.selected = [];
    this.search = '';
  }

  /**
   * Navigates to board view after 3 second delay
   */
  changeToBoard() {
    timer(3000).subscribe(() => {
      this.router.navigate(['/board']);
    });
  }

  /**
   * Displays confirmation message temporarily
   * @param message - Message to display
   */
  showConfirmation(message: string) {
    this.confirmationMessage = message;
    setTimeout(() => {
      this.confirmationMessage = '';
    }, 2000);
  }

  /**
   * Loads all tasks from board service
   */
  async loadTasks() {
    this.taskList = [];
    let tasks = this.boardService.taskList;
    if (tasks && tasks.length > 0) {
      this.taskList = tasks;
    }
  }

  /**
   * Updates an existing task in Firebase
   * @param task - Task object to update
   */
  async updateTask(task: TaskInterface) {
    await this.boardService.updateTaskInFirebase(task);
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
   * Marks current user's contact with isYou flag
   * Compares contact emails with yourEmail property
   */
  setIsYouForContacts() {
    this.contactList = this.contactList.map(contact => ({
      ...contact,
      isYou: contact.email === this.yourEmail
    }));
  }

  /**
   * Initializes component
   * Loads contacts from service and marks current user
   */
  async ngOnInit() {
    // Kontakte im Service laden, falls noch nicht vorhanden
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase(); // Diese Methode muss im Service existieren!
    }
    this.contactList = this.sortContactsAlphabetically(this.contactService.contactList);
    this.setIsYouForContacts();
  }

  /**
   * Filters contact list based on search term
   * Updates visibility flag for each contact
   */
  filterUsers() {
    let searchTerm = this.search.trim().toLowerCase();
    if (!searchTerm) {
      this.open = true;
      this.contactList = this.sortContactsAlphabetically(this.contactList);
      return;
    }
    let filteredContacts = this.contactList.map(contact => ({
      ...contact,
      visible: `${contact.firstname} ${contact.lastname}`.toLowerCase().includes(searchTerm)
    }));
    this.contactList = this.sortContactsAlphabetically(filteredContacts);
  }

  /**
   * Toggles contact selection for task assignment
   * Adds or removes contact from selected array
   * @param contact - Contact to toggle
   */
  toggleSelect(contact: ContactInterface) {
    let exists = this.selected.some(u => u.id === contact.id);
    if (exists) {
      this.selected = this.selected.filter(u => u.id !== contact.id);
    } else {
      this.selected = [...this.selected, contact];
    }
  }

  /**
   * Checks if contact is currently selected
   * @param contact - Contact to check
   * @returns True if contact is selected
   */
  isContactSelected(contact: ContactInterface): boolean {
    return this.selected.some(selectedContact => selectedContact.id === contact.id);
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
   * Toggles assigned contacts dropdown visibility
   * @param event - Mouse event to stop propagation
   */
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.open = !this.open;
  }

  /**
   * Toggles category dropdown visibility
   * @param event - Mouse event to stop propagation
   */
  toggleCategoryDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  /**
   * Selects a task category and closes dropdown
   * @param category - Selected task category
   */
  selectCategory(category: TaskInterface['taskCategory']) {
    this.newTask.taskCategory = category;
    this.categoryDropdownOpen = false;
  }

  /**
   * Adds or updates a subtask
   * Creates new subtask or updates existing one based on edit index
   */
  addSubtask() {
    let title = this.subtaskInput.trim();
    if (!title) {
      return;
    }
    if (this.subtaskEditIndex !== null && this.subtaskEditIndex >= 0) {
      this.newTask.subTasks[this.subtaskEditIndex].title = title;
      this.subtaskEditIndex = null;
    } else {
      this.newTask.subTasks = [
        ...this.newTask.subTasks,
        { title, completed: false }
      ];
    }
    this.clearSubtaskInput();
  }

  /**
   * Starts editing an existing subtask
   * Loads subtask title into input field
   * @param index - Index of subtask to edit
   */
  startEditSubtask(index: number) {
    this.subtaskEditIndex = index;
    this.subtaskInput = this.newTask.subTasks[index].title;
    // open input focus handled by template if needed
  }

  /**
   * Saves subtask edit changes
   * Wrapper for addSubtask method
   */
  saveSubtaskEdit() {
    this.addSubtask();
  }

  /**
   * Removes a subtask from the list
   * Adjusts edit index if needed
   * @param index - Index of subtask to remove
   */
  removeSubtask(index: number) {
    this.newTask.subTasks = this.newTask.subTasks.filter((_, i) => i !== index);
    // If we removed the edited item, reset edit state
    if (this.subtaskEditIndex !== null && this.subtaskEditIndex === index) {
      this.clearSubtaskInput();
      this.subtaskEditIndex = null;
    } else if (this.subtaskEditIndex !== null && this.subtaskEditIndex! > index) {
      // shift edit index if an earlier item removed
      this.subtaskEditIndex!--;
    }
  }

  /**
   * Clears subtask input field and resets edit state
   */
  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskEditIndex = null;
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

}
