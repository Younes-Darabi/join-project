import { Injectable, OnDestroy, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, query, updateDoc,} from '@angular/fire/firestore';
import { TaskInterface } from '../../interfaces/board/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService implements OnDestroy {
  taskList: TaskInterface[] = [];
  firestore: Firestore = inject(Firestore);
  unsubTasks;
  toDoList: TaskInterface[] = [];
  inProgressList: TaskInterface[] = [];
  awaitFeedbackList: TaskInterface[] = [];
  doneList: TaskInterface[] = [];

  constructor() {
    this.unsubTasks = this.getTasksFromFirebase();
  }

  ngOnDestroy() {
    if (this.unsubTasks) {
      this.unsubTasks();
    }
  }

  sortTasksByStatus() {
    this.toDoList = [];
      this.inProgressList = [];
      this.awaitFeedbackList = [];
      this.doneList = [];

      this.taskList.forEach(task => {
        console.log('task:' + task);
        
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
    }
  

  async addTask(task: TaskInterface) {
    let cleantask = this.getCleanTaskJson(task);
    await addDoc(this.getTaskRef(), cleantask)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Task successfully added', docRef?.id);
      });
  }

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

  async updateTaskInFirebase(task: TaskInterface) {
    if (task.id) {
      const docRef = this.getSingleTaskDocRef(this.getTaskCollectionId(task), task.id);
      const cleanTask = this.getCleanTaskJson(task);
      await updateDoc(docRef, cleanTask)
        .then(() => {
          console.log('Task successfully updated');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async deleteTaskFromFirebase(task: TaskInterface) {
    if (task.id) {
      await deleteDoc(this.getSingleTaskDocRef(this.getTaskCollectionId(task), task.id));
    }
  }

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

  getTaskCollectionId(task: TaskInterface): string {
    return 'tasks';
  }

  getTaskRef() {
    return collection(this.firestore, 'tasks');
  }

  getSingleTaskDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
