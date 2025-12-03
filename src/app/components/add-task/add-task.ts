import { Component, inject, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact-service';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { NgClass } from '@angular/common';
import { TaskInterface } from '../../interfaces/board/task.interface';
import { BoardService } from '../../services/board/board-service';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, NgClass],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.scss'],
})
export class AddTask {
  @Input() status!:string;

  boardService = inject(BoardService);
  contactService = inject(ContactService);
  taskList: TaskInterface[] = [];
  contactList: ContactInterface[] = [];
  search: string = '';
  open: boolean = false;
  selected: ContactInterface[] = [];
  confirmationMessage: string = '';
  errorMessage: string = '';
  formSubmitted: boolean = false;
  categoryDropdownOpen: boolean = false;
  categoryOptions: TaskInterface['taskCategory'][] = ['User Story', 'Technical Task'];
  yourEmail: string = 'deine@email.de';

  newTask: TaskInterface = {
    id: '',
    title: '',
    description: '',
    assignedTo: [],
    dueDate: null,
    status: 'todo',
    priority: 'medium',
    taskCategory: '',
    subTasks: []
  };


  
  // die Prio muss ausgewählt werden können
  // die subtasks müssen hinzugefügt werden
  // der Button clear funktioniert noch nicht bei subtasks
  // der button add task funktioniert nur wenn alle Pflichtfelder ausgefüllt sind
  // das design muss noch angepasst werden
  // responsive design muss noch gemacht werden
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
    this.showConfirmation('Task successfully created!');
    this.formSubmitted = false;
  }

  resetForm() {
		this.newTask = {
			id: '',
			title: '',
			description: '',
			assignedTo: [],
			dueDate: null,
			status: 'todo',
			priority: '',
			taskCategory: '',
			subTasks: []
		};
		this.selected = [];
		this.search = '';
	}

  showConfirmation(message: string) {
    this.confirmationMessage = message;
    setTimeout(() => {
      this.confirmationMessage = '';
    }, 2000);
  }

  async loadTasks() {
    this.taskList = [];
    let tasks = this.boardService.taskList;
    if (tasks && tasks.length > 0) {
      this.taskList = tasks;
    }
  }

  async updateTask(task: TaskInterface) {
    await this.boardService.updateTaskInFirebase(task);
  }

  sortContactsAlphabetically(contact: ContactInterface[]) {
    return this.contactService.sortContacts(contact);
  }

  setIsYouForContacts() {
    this.contactList = this.contactList.map(contact => ({
      ...contact,
      isYou: contact.email === this.yourEmail
    }));
  }

  async ngOnInit() {
    // Kontakte im Service laden, falls noch nicht vorhanden
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase(); // Diese Methode muss im Service existieren!
    }
    this.contactList = this.sortContactsAlphabetically(this.contactService.contactList);
    this.setIsYouForContacts();
  }

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

  toggleSelect(contact: ContactInterface) {
    let exists = this.selected.some(u => u.id === contact.id);
    if (exists) {
      this.selected = this.selected.filter(u => u.id !== contact.id);
    } else {
      this.selected = [...this.selected, contact];
    }
  }

  isContactSelected(contact: ContactInterface): boolean {
    return this.selected.some(selectedContact => selectedContact.id === contact.id);
  }

  getDropdownItemClass(contact: ContactInterface): string {
    return this.isContactSelected(contact) ? 'assigned_dropdown_item_active' : '';
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.open = !this.open;
  }

  toggleCategoryDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  selectCategory(category: TaskInterface['taskCategory']) {
    this.newTask.taskCategory = category;
    this.categoryDropdownOpen = false;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.open = false;
    this.categoryDropdownOpen = false;
  }

}
