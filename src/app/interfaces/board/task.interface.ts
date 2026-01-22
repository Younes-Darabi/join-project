/**
 * Interface representing a task on the board
 * Defines the structure for task objects with all required properties
 * 
 * @author Kevin Hase
 */
export interface TaskInterface {
  /** Unique identifier for the task */
  id: string;
  
  /** Title of the task */
  title: string;
  
  /** Detailed description of the task */
  description: string;
  
  /** Array of contact IDs assigned to this task */
  assignedTo: string[];
  
  /** Due date for the task, null if not set */
  dueDate: Date | null;
  
  /** Current status of the task */
  status: 'todo' | 'in-progress' | 'await-feedback' | 'done';
  
  /** Priority level of the task */
  priority: string;
  
  /** Category type of the task */
  taskCategory: 'Technical Task' | 'User Story' | '';
  
  /** Array of subtasks with completion status */
  subTasks: { title: string; completed: boolean }[];
}