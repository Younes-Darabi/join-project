import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { TaskInterface } from "../../../interfaces/board/task.interface";
import { ContactInterface } from "../../../interfaces/contact/contact-list.interface";
import { BoardService } from "../../../services/board/board-service";
import { ContactService } from "../../../services/contact/contact-service";

/**
 * Component for displaying a task card on the board
 * Shows task information including progress, assigned contacts, and priority
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-task.html',
  styleUrl: './card-task.scss',
})
export class CardTask {
  /** Task object to display */
  @Input() task!: TaskInterface;

  /** Board service for task operations */
  boardService = inject(BoardService);

  /** Contact service for retrieving contact information */
  contactService = inject(ContactService);

  /** Number of completed subtasks */
  taskcompleted: number = 0;

  /**
   * Initializes component
   * Loads contacts from Firebase if not already loaded
   */
  async ngOnInit() {
    if (!this.contactService.contactList || this.contactService.contactList.length === 0) {
      await this.contactService.loadContactsFromFirebase();
    }
  }

  /**
   * Recalculates completed subtasks when input changes
   * Counts how many subtasks are marked as completed
   */
  ngOnChanges() {
    this.taskcompleted = 0;
    this.task.subTasks.forEach(subTask => {
      if (subTask.completed) this.taskcompleted++;
    });
  }

  /**
   * Retrieves contact details by contact ID
   * @param id - Contact ID to search for
   * @returns Contact object if found, undefined otherwise
   */
  getContactDetailsById(id: string): ContactInterface | undefined {
    return this.contactService.contactList.find(contact => contact.id === id);
  }
}