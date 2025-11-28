import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact-service';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { getDocs } from 'firebase/firestore';
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
  boardService = inject(BoardService);
  contactService = inject(ContactService);
  taskList: TaskInterface[] = [];
  contactList: ContactInterface[] = [];
  search: string = '';
  open: boolean = false;
  selected: ContactInterface[] = [];

  yourEmail: string = 'deine@email.de';

  newTask: TaskInterface = {
    id: '',
    title: '',
    description: '',
    assignedTo: [],
    dueDate: new Date(),
    status: 'todo',
    priority: '',
    taskCategory: 'User Story',
    subTasks: []
  };

  async saveTask(task: TaskInterface) {
    await this.boardService.addTask(task);
  }

  async loadTasks(): Promise<void> {
    this.taskList = [];
    let tasks = this.boardService.taskList;
    if (tasks && tasks.length > 0) {
      this.taskList = tasks;
    }
  }

  async updateTask(task: TaskInterface): Promise<void> {
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
    let collectionRef = this.contactService.getContactsRef();
    let snapshot = await getDocs(collectionRef);
    let loadedContacts = snapshot.docs.map(doc =>
      this.contactService.setContactObject(doc.data(), doc.id)
    );
    this.contactList = this.sortContactsAlphabetically(loadedContacts);
    this.setIsYouForContacts();
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let input = document.getElementById('assigned_dropdown_input');
    let dropdownList = document.querySelector('.assigned_dropdown_list');
    if (
      input &&
      !input.contains(target) &&
      dropdownList &&
      !dropdownList.contains(target)
    ) {
      this.open = false;
    }
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
}