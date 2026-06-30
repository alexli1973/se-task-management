import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ApiClientService} from '../core/api/api-client.service';
import {ITask, TaskStatus} from './task.models';

// HTTP-only: no state here. State + orchestration live in TaskStore.
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly api = inject(ApiClientService);

  // GET /tasks?userId=<id>
  getForUser(userId: number): Observable<ITask[]> {
    return this.api
      .get<ITask[]>('/tasks', {userId})
      .pipe(map(tasks => tasks.map(task => this.normalize(task))));
  }

  // POST /tasks (the server assigns the id)
  createTask(task: Omit<ITask, 'id'>): Observable<ITask> {
    return this.api.post<ITask>('/tasks', task).pipe(map(created => this.normalize(created)));
  }

  // userId is a numeric foreign key but may arrive as a string from the API — coerce it.
  // id stays as-is: it's an opaque string the server controls.
  private normalize(task: ITask): ITask {
    return {...task, userId: Number(task.userId)};
  }

  // DELETE /tasks/<id>
  deleteTask(id: string): Observable<void> {
    return this.api.delete<void>('/tasks/' + id);
  }

  // PATCH /tasks/<id> { status }
  updateStatus(id: string, status: TaskStatus): Observable<ITask> {
    return this.api.patch<ITask>('/tasks/' + id, {status});
  }
}
