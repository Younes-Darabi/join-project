import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule],
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
    dueDate: null,
    status: 'todo',
    priority: '',
    taskCategory: 'User Story',
    subTasks: [],
  }

  editPageShow: boolean = false


  closeTaskDetail() {
    this.display = 'none';
  }

  showTaskDetail(task: TaskInterface) {
    this.task = task;
    this.display = 'flex';
  }
}
