import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board/board-service';
import { TaskInterface } from '../../interfaces/board/task.interface';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Component for displaying task summary dashboard
 * Shows task statistics, greeting message, and urgent task information
 * Provides overview of tasks organized by status
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  /** Authentication service for user management */
  authService = inject(AuthService);
  
  /** Current user's full name */
  userName: string = '';

  /** Board service for task operations */
  boardService = inject(BoardService);
  
  /** Current date and time */
  nowDate = new Date();
  
  /** Current hour for greeting message */
  currentHour = this.nowDate.getHours();
  
  /** Array of all tasks */
  tasks: TaskInterface[] = [];
  
  /** Array of todo tasks */
  todo: TaskInterface[] = [];
  
  /** Array of in-progress tasks */
  inProgress: TaskInterface[] = [];
  
  /** Array of await-feedback tasks */
  awaitFeedback: TaskInterface[] = [];
  
  /** Array of done tasks */
  done: TaskInterface[] = [];
  
  /** Filtered array of tasks */
  filteredTasks: TaskInterface[] = [];
  
  /** User's full name for display */
  usersFullName: string = '';
  
  /** Flag to show greeting message */
  showGreeting: boolean = false;
  
  /** Flag to show main content */
  showMainContent: boolean = false;
  
  /** Flag indicating if greeting was already shown */
  greetingShown: boolean = false;

  /**
   * Creates an instance of Summary
   * Initializes tasks and sets up authentication
   * @param firestore - Firestore database instance
   * @param router - Router for navigation
   * @param route - Current route information
   */
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

  /**
   * Initializes component
   * Checks greeting state and loads user data
   */
  ngOnInit() {
    if (this.getGreetingShownFromSessionStorage() == 'true') {
      this.greetingShown = true;
    }
    this.showGreetingOnce();
    this.loadUserData();
  }

  /**
   * Loads current user data and updates userName
   * Sets empty string if user not authenticated
   */
  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isAuthenticated) {
      this.userName = fullName.firstName + ' ' + fullName.lastName;
    } else {
      this.userName = '';
    }
  }

  /**
   * Shows greeting animation once on mobile devices
   * Manages greeting display timing and session storage
   */
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

  /**
   * Stores greeting shown state in session storage
   */
  setGreetingShownInSessionStorage() {
    if (this.greetingShown) {
      sessionStorage.setItem('greetingShown', 'true');
    }
  }

  /**
   * Retrieves greeting shown state from session storage
   * @returns String value from session storage or null
   */
  getGreetingShownFromSessionStorage() {
    return sessionStorage.getItem('greetingShown');
  }

  /**
   * Sorts all tasks into status-specific arrays
   * Clears existing arrays and categorizes each task
   */
  sortTasks() {
    this.todo = [];
    this.awaitFeedback = [];
    this.inProgress = [];
    this.done = [];

    this.filteredTasks.forEach((task) => {
      this.categorizeTask(task);
    });
  }

  /**
   * Categorizes a single task by status
   * Adds task to appropriate status array
   * @param task - Task to categorize
   */
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

  /**
   * Gets count of todo tasks
   * @returns Number of todo tasks
   */
  getTodoTaskCount() {
    this.sortTasks();
    return this.todo.length;
  }

  /**
   * Gets count of await-feedback tasks
   * @returns Number of await-feedback tasks
   */
  getAwaitFeedbackTaskCount() {
    this.sortTasks();
    return this.awaitFeedback.length;
  }

  /**
   * Gets count of in-progress tasks
   * @returns Number of in-progress tasks
   */
  getInProgressTaskCount() {
    this.sortTasks();
    return this.inProgress.length;
  }

  /**
   * Gets count of done tasks
   * @returns Number of done tasks
   */
  getDoneTasksCount() {
    this.sortTasks();
    return this.done.length;
  }

  /**
   * Gets total count of all tasks
   * @returns Total number of tasks
   */
  getAllTaskCount() {
    return this.filteredTasks.length;
  }

  /**
   * Gets appropriate greeting message based on current hour
   * @returns Greeting string for current time of day
   */
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