export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // Array of contact IDs
  dueDate: Date;
  status: 'todo' | 'in-progress' | 'done';
  priority: string;
  taskCategory: 'Technocal Task' | 'User Story';
  subTasks: string[];
}