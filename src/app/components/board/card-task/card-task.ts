import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { TaskInterface } from "../../../interfaces/board/task.interface";
import { ContactInterface } from "../../../interfaces/contact/contact-list.interface";
import { BoardService } from "../../../services/board/board-service";
import { ContactService } from "../../../services/contact/contact-service";

@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-task.html',
  styleUrl: './card-task.scss',
})
export class CardTask {
  @Input() task!: TaskInterface;
  boardService = inject(BoardService);
  contactService = inject(ContactService);
  taskcompleted: number = 0;

  async ngOnInit() {
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase();
    }
  }

  ngOnChanges() {
    this.taskcompleted = 0;
    this.task.subTasks.forEach(subTask => {
      if (subTask.completed) this.taskcompleted++;
    });
  }

  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find(contact => contact.id === id);
  }
}
