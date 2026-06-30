// Task domain models — shape matches the API (db.json)
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface ITask {
  // Opaque, server-assigned identifier (json-server generates random strings).
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: number;
}

// What the new-task form produces. The store attaches userId, the server the id.
export type NewTaskInput = Omit<ITask, 'id' | 'userId'>;

// Fixed column order for the board (structural config, labels live in texts)
export const TASK_STATUS_ORDER: readonly TaskStatus[] = ['todo', 'in-progress', 'done'];

// Priority filter value: a concrete priority, or 'all' for no priority filter
export type PriorityFilter = TaskPriority | 'all';

// View-model for a single board column (label resolved in the view from BOARD_TEXTS)
export interface IBoardColumn {
  status: TaskStatus;
  tasks: ITask[];
}
