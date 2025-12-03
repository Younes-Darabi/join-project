import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, inject, ViewChild } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../services/contact/contact-service';


@Component({
  selector: 'app-card-details',
  imports: [CommonModule, EditDialogComponent],
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
})
export class CardDetails {
  boardService = inject(BoardService);
  contactService = inject(ContactService);
  @HostBinding('style.display') display = 'none';
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
  editPageShow: boolean = false;
  hostElement = inject(ElementRef);
  @ViewChild(EditDialogComponent) EditDialogComponent!: EditDialogComponent;

  closeTaskDetail() {
    this.display = 'none';
    this.hostElement.nativeElement.classList.remove('show');
  }

  openEditDetail(task: TaskInterface) {
    this.editPageShow = true;
    this.EditDialogComponent.showEditDetail(task);
  }

  showTaskDetail(task: TaskInterface) {
    this.task = task;
    this.display = 'flex';
    this.hostElement.nativeElement.classList.add('show');
  }

  onTaskSaved(updatedTask: TaskInterface) {
    this.task = { ...updatedTask };
    const index = this.boardService.taskList.findIndex((t) => t.id === updatedTask.id);
    if (index > -1) {
      this.boardService.taskList[index] = updatedTask;
    }
    this.boardService.sortTasksByStatus();
  }

  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find(contact => contact.id === id);
  }
}
