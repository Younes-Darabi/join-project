import { Injectable, OnDestroy, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, query, updateDoc, } from '@angular/fire/firestore';
import { TaskInterface } from '../../interfaces/board/task.interface';

/**
 * Service for managing tasks on the board
 * Handles CRUD operations for tasks in Firebase
 * Organizes tasks by status and provides filtering capabilities
 * 
 * @author Kevin Hase
 */
@Injectable({
  providedIn: 'root',
})
export class BoardService implements OnDestroy {
  /** Array of all tasks */
  taskList: TaskInterface[] = [];
  
  /** Firestore database instance */
  firestore: Firestore = inject(Firestore);
  
  /** Unsubscribe function for Firestore listener */
  unsubTasks;
  
  /** Array of tasks with status 'todo' */
  toDoList: TaskInterface[] = [];
  
  /** Array of tasks with status 'in-progress' */
  inProgressList: TaskInterface[] = [];
  
  /** Array of tasks with status 'await-feedback' */
  awaitFeedbackList: TaskInterface[] = [];
  
  /** Array of tasks with status 'done' */
  doneList: TaskInterface[] = [];
  
  /** Currently selected task */
  selectedTask?: TaskInterface;
  
  /** Original unfiltered todo list */
  originalToDoList: TaskInterface[] = [];
  
  /** Original unfiltered in-progress list */
  originalInProgressList: TaskInterface[] = [];
  
  /** Original unfiltered await-feedback list */
  originalAwaitFeedbackList: TaskInterface[] = [];
  
  /** Original unfiltered done list */
  originalDoneList: TaskInterface[] = [];

  /**
   * Creates an instance of BoardService
   * Sets up real-time Firestore listener for tasks
   */
  constructor() {
    this.unsubTasks = this.getTasksFromFirebase();
  }

  /**
   * Cleanup on service destruction
   * Unsubscribes from Firestore listener
   */
  ngOnDestroy() {
    if (this.unsubTasks) {
      this.unsubTasks();
    }
  }

  /**
   * Sorts all tasks into status-specific lists
   * Creates backup copies for filtering purposes
   */
  sortTasksByStatus() {
    this.toDoList = [];
    this.inProgressList = [];
    this.awaitFeedbackList = [];
    this.doneList = [];

    this.taskList.forEach(task => {
      switch (task.status) {
        case 'todo':
          this.toDoList.push(task);
          break;
        case 'in-progress':
          this.inProgressList.push(task);
          break;
        case 'await-feedback':
          this.awaitFeedbackList.push(task);
          break;
        case 'done':
          this.doneList.push(task);
          break;
      }
    });

    this.originalToDoList = [...this.toDoList];
    this.originalInProgressList = [...this.inProgressList];
    this.originalAwaitFeedbackList = [...this.awaitFeedbackList];
    this.originalDoneList = [...this.doneList];
  }

  /**
   * Filters task lists based on search term
   * Searches in task title and description
   * @param searchTerm - Search term to filter tasks by
   */
  filteredLists(searchTerm: string) {
    const term = searchTerm.toLowerCase();

    const matches = (task: TaskInterface) =>
      task.title?.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term);

    this.toDoList = this.originalToDoList.filter(matches);
    this.inProgressList = this.originalInProgressList.filter(matches);
    this.awaitFeedbackList = this.originalAwaitFeedbackList.filter(matches);
    this.doneList = this.originalDoneList.filter(matches);
  }

  /**
   * Adds a new task to Firestore
   * @param task - Task object to add
   */
  async addTask(task: TaskInterface) {
    let cleantask = this.getCleanTaskJson(task);
    try {
      let docRef = await addDoc(this.getTaskRef(), cleantask);
      // console.log('Task successfully added', docRef?.id);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Gets the count of urgent priority tasks
   * @returns Number of urgent tasks
   */
  get urgentTaskCount(): number {
    return this.taskList.filter(task => task.priority === 'urgent').length;
  }

  /**
   * Gets the next upcoming urgent task deadline
   * @returns Formatted date string or message if no urgent tasks
   */
  get nextUrgentDeadline(): string {
    let urgentTasks = this.taskList.filter(task => task.priority === 'urgent');

    if (urgentTasks.length === 0) {
      return 'No urgent tasks';
    }

    let taskWithLowestDate = urgentTasks[0];
    urgentTasks.forEach((urgentTask) => {
      if (urgentTask.dueDate) {
        let currentDate = new Date(urgentTask.dueDate);
        let lowestDate = new Date(taskWithLowestDate.dueDate || '');
        if (currentDate < lowestDate) {
          taskWithLowestDate = urgentTask;
        }
      }
    });

    return this.formatTaskDate(taskWithLowestDate);
  }

  /**
   * Formats task due date to readable string
   * @param task - Task with due date to format
   * @returns Formatted date string
   */
  formatTaskDate(task: TaskInterface): string {
    if (task.dueDate) {
      let date = new Date(task.dueDate);
      let formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
      return formattedDate;
    }
    return 'No date found';
  }

  /**
   * Sets up real-time listener for tasks from Firestore
   * Updates taskList and sorts by status on changes
   * @returns Unsubscribe function
   */
  getTasksFromFirebase() {
    const q = query(this.getTaskRef());
    return onSnapshot(
      q,
      (list) => {
        this.taskList = [];
        list.forEach((element) => {
          this.taskList.push(this.setTasksObject(element.data(), element.id));
        });

        this.sortTasksByStatus()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Updates an existing task in Firestore
   * @param task - Task object with updated data
   */
  async updateTaskInFirebase(task: TaskInterface) {
    if (task.id) {
      const docRef = this.getSingleTaskDocRef(this.getTaskCollectionId(task), task.id);
      const cleanTask = this.getCleanTaskJson(task);
      await updateDoc(docRef, cleanTask)
        .then(() => {
          // console.log('Task successfully updated');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  /**
   * Deletes a task from Firestore
   * @param task - Task object to delete
   */
  async deleteTaskFromFirebase(task: TaskInterface) {
    if (task.id) {
      await deleteDoc(this.getSingleTaskDocRef(this.getTaskCollectionId(task), task.id));
    }
  }

  /**
   * Converts Firestore data object to TaskInterface
   * @param obj - Raw Firestore data object
   * @param id - Document ID
   * @returns Task object with all properties
   */
  setTasksObject(obj: any, id: string): TaskInterface {
    return {
      id: id || '',
      title: obj.title || '',
      description: obj.description || '',
      assignedTo: obj.assignedTo || [],
      dueDate: obj.dueDate || new Date(),
      status: obj.status || 'todo',
      priority: obj.priority || '',
      taskCategory: obj.taskCategory || 'Technical Task',
      subTasks: obj.subTasks || [],
    };
  }

  /**
   * Creates a clean JSON object from task data
   * Removes ID property for Firestore storage
   * @param task - Task object to clean
   * @returns Clean task object for Firestore
   */
  getCleanTaskJson(task: TaskInterface): any {
    return {
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      taskCategory: task.taskCategory,
      subTasks: task.subTasks,
    };
  }

  /**
   * Gets the Firestore collection ID for a task
   * @param task - Task object
   * @returns Collection ID string
   */
  getTaskCollectionId(task: TaskInterface): string {
    return 'tasks';
  }

  /**
   * Gets reference to the tasks collection in Firestore
   * @returns Firestore collection reference
   */
  getTaskRef() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Gets reference to a single task document in Firestore
   * @param colId - Collection ID
   * @param docId - Document ID
   * @returns Firestore document reference
   */
  getSingleTaskDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
