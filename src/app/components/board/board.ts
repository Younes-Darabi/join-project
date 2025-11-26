import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CardComponent } from "./card/card.component";

interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  assignedTo: string[];
  category: string;
  subtasks: string[];
}

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CardComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {

  toDoList: Task[] = [
    {
      title: 'CSS Architecture Planning',
      description: 'Define CSS naming conventions and structure.',
      dueDate: '02/09/2023',
      priority: 'Urgent',
      assignedTo: ['Sofia Müller', 'Benedikt Ziegler'],
      category: 'Technical Task',
      subtasks: ['Establish CSS Methodology', 'Setup Base Styles'],
    },
    {
      title: 'Kochwelt Page & Recipe Recommender',
      description: 'Build start page with recipe recommendation.',
      dueDate: '10/05/2023',
      priority: 'Medium',
      assignedTo: ['Emmanuel Mauer', 'Marcel Bauer', 'Anton Mayer'],
      category: 'User Story',
      subtasks: ['Implement Recipe Recommendation', 'Start Page Layout'],
    }
  ];
  inProgressList: Task[] = [];
  awaitFeedbackList: Task[] = [];
  doneList: Task[] = [];

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}

