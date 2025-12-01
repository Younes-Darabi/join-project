export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  dueDate: Date;
  status: 'todo' | 'in-progress' | 'await-feedback' | 'done';
  priority: string;
  taskCategory: 'Technical Task' | 'User Story' | '';
  subTasks: string[];
}