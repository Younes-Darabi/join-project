import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskInterface } from '../../../interfaces/board/task.interface';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { BoardService } from '../../../services/board/board-service';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  
  @Input() item!: TaskInterface;  
  isDragging: boolean = false;  
  selectedItem!: TaskInterface;  
  isDialogOpen: boolean = false;
  boardService = inject(BoardService);
  
  constructor() {
    
  }
 
  openCardDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
    }
  }
}