import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board/board-service';
import { TaskInterface } from '../../interfaces/board/task.interface';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  authService = inject(AuthService);
  userName: string = '';

  boardService = inject(BoardService);
  nowDate = new Date();
  currentHour = this.nowDate.getHours();
  tasks: TaskInterface[] = [];
  todo: TaskInterface[] = [];
  inProgress: TaskInterface[] = [];
  awaitFeedback: TaskInterface[] = [];
  done: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  usersFullName: string = '';
  showGreeting: boolean = false;
  showMainContent: boolean = false;
  greetingShown: boolean = false;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tasks = this.boardService.taskList;
    this.filteredTasks = this.tasks;
    this.sortTasks();
    const auth = getAuth();

  }

  ngOnInit() {
    if (this.getGreetingShownFromSessionStorage() == 'true') {
      this.greetingShown = true;
    }
    this.showGreetingOnce();
    this.loadUserData();
  }

  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isAuthenticated) {
      this.userName = fullName.firstName + ' ' + fullName.lastName;
    } else {
      this.userName = '';
    }
  }

  showGreetingOnce() {
    if (window.innerWidth <= 900 && !this.greetingShown) {
      this.showGreeting = true;
      setTimeout(() => {
        this.showGreeting = false;
        this.showMainContent = true;
        this.greetingShown = true;
        this.setGreetingShownInSessionStorage();
      }, 5000);
    } else if (window.innerWidth <= 900 && this.getGreetingShownFromSessionStorage() == 'true') {
      this.showGreeting = false;
      this.showMainContent = true;
    } else {
      this.showGreeting = true;
      this.showMainContent = true;
    }
  }

  setGreetingShownInSessionStorage() {
    if (this.greetingShown) {
      sessionStorage.setItem('greetingShown', 'true');
    }
  }

  getGreetingShownFromSessionStorage() {
    return sessionStorage.getItem('greetingShown');
  }

  sortTasks() {
    this.todo = [];
    this.awaitFeedback = [];
    this.inProgress = [];
    this.done = [];

    this.filteredTasks.forEach((task) => {
      this.categorizeTask(task);
    });
  }

  categorizeTask(task: TaskInterface) {
    if (task.status === 'todo') {
      this.todo.push(task);
    } else if (task.status === 'await-feedback') {
      this.awaitFeedback.push(task);
    } else if (task.status === 'in-progress') {
      this.inProgress.push(task);
    } else if (task.status === 'done') {
      this.done.push(task);
    }
  }

  getTodoTaskCount() {
    this.sortTasks();
    return this.todo.length;
  }

  getAwaitFeedbackTaskCount() {
    this.sortTasks();
    return this.awaitFeedback.length;
  }

  getInProgressTaskCount() {
    this.sortTasks();
    return this.inProgress.length;
  }

  getDoneTasksCount() {
    this.sortTasks();
    return this.done.length;
  }

  getAllTaskCount() {
    return this.filteredTasks.length;
  }

  getGreeting() {
    if (this.currentHour > 3 && this.currentHour < 12) {
      return 'Good morning';
    }
    if (this.currentHour >= 12 && this.currentHour < 18) {
      return 'Good afternoon';
    }
    if (this.currentHour >= 18 && this.currentHour <= 19) {
      return 'Good evening';
    } else return 'Good night';
  }
}