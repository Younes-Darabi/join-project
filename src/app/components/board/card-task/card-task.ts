import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TaskInterface } from "../../../interfaces/board/task.interface";


@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-task.html',
  styleUrl: './card-task.scss'
})

export class CardTask {
  @Input() task!: TaskInterface;

}