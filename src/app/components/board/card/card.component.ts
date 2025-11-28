import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent {
  @HostBinding('style.display') display = 'felx';
  task: TaskInterface | undefined;

closeTaskDetail() {
  this.display = 'none';
}

showTaskDetail(task: TaskInterface) {
  this.task = task;
  this.display = 'flex';
}
}