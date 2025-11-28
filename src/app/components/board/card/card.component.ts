import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { Injectable} from '@angular/core';

import { BoardService } from '../../../services/board/board-service';




@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() item?: TaskInterface;
  boardService = inject(BoardService);

  selectedItem?: TaskInterface;
  isDialogOpen: boolean = false;

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  openEditDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }
 
  closeEditDialog() {
    this.isDialogOpen = false; 
    
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  
}