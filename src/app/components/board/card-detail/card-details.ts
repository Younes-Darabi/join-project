import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, Input } from '@angular/core';
import { TaskInterface } from '../../../interfaces/board/task.interface';
import { BoardService } from '../../../services/board/board-service';
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, EditDialogComponent],
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
  isDialogOpen: boolean = false;
  isDeleteOpen: boolean = false;
  selectedItem?: TaskInterface;

  @Input() item?: TaskInterface;


  closeTaskDetail() {
    this.display = 'none';
  }

  closeEditDialog() {
    this.isDialogOpen = false; 
    this.isDeleteOpen = false;
  }

  showTaskDetail(task: TaskInterface) {
    this.task = task;
    this.display = 'flex';
  }

   stopPropagation(event: Event) {
    event.stopPropagation();
  }

   opendeleteDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDeleteOpen = true;
  }

  openEditDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

}

