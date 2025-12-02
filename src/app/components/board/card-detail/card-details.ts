import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, ViewChild } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';
import { EditDialogComponent } from "./edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-card-details',
  imports: [CommonModule, EditDialogComponent],
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss']
})

export class CardDetails {
  boardService = inject(BoardService);
  @HostBinding('style.display') display = 'none';
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
  }
  editPageShow: boolean = false
  @ViewChild(EditDialogComponent) EditDialogComponent!: EditDialogComponent;

  closeTaskDetail() {
    this.display = 'none';
  }


  openEditDetail(task: TaskInterface) {
    this.EditDialogComponent.showEditDetail(task);
  }

  showTaskDetail(task: TaskInterface) {
    this.task = task;
    this.display = 'flex';
  }
}

