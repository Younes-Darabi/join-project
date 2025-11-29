import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-details.html',
  styleUrl: './card-details.scss'
})

export class CardDetails {
  @HostBinding('style.display') display = 'felx';
  task: TaskInterface | undefined;
  editPageShow: boolean = false;

closeTaskDetail() {
  this.display = 'none';
}

showTaskDetail(task: TaskInterface) {
  this.task = task;
  this.display = 'flex';
}
}