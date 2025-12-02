import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';

@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-task.html',
  styleUrl: './card-task.scss',
})
export class CardTask {
  @Input() task!: TaskInterface;
  BoardService = inject(BoardService);
}
