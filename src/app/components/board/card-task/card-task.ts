import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { TaskInterface } from "../../../interfaces/board/task.interface";
import { ContactInterface } from "../../../interfaces/contact/contact-list.interface";
import { BoardService } from "../../../services/board/board-service";
import { ContactService } from "../../../services/contact/contact-service";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-task.html',
  styleUrl: './card-task.scss',
})
export class CardTask {
  @Input() task!: TaskInterface;
  boardService = inject(BoardService);
  contactService = inject(ContactService);
  selectedTask?: TaskInterface;
  showTaskDetail = false;

  async ngOnInit() {
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase();
    }
  }

  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find(contact => contact.id === id);
  }

  get completedSubtaskCount(): number {
  return this.task.subTasks?.filter(s => s.completed).length ?? 0;
}

get totalSubtaskCount(): number {
  return this.task.subTasks?.length ?? 0;
}

get progressPercent(): number {
  if (!this.task.subTasks || this.task.subTasks.length === 0) return 0;
  const completed = this.task.subTasks.filter(s => s.completed).length;
  return (completed / this.task.subTasks.length) * 100;
}

openTaskDetail(task: TaskInterface) {
  this.boardService.selectedTask = task;
  this.showTaskDetail = true;
}


}
