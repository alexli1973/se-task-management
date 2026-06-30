import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EMPTY, finalize, Observable, tap} from 'rxjs';
import {TasksService} from './tasks.service';
import {AuthService} from '../auth/auth.service';
import {IBoardColumn, ITask, NewTaskInput, PriorityFilter, TASK_STATUS_ORDER, TaskStatus} from './task.models';

const SEARCH_MIN_LENGTH = 3;

// Not providedIn: 'root' — scoped to the Dashboard, so state dies with the feature.
@Injectable()
export class TaskStore {
  private readonly tasksService = inject(TasksService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _tasks = signal<ITask[]>([]);
  private readonly _inFlight = signal(0);
  private readonly _search = signal('');
  private readonly _priority = signal<PriorityFilter>('all');

  readonly tasks = this._tasks.asReadonly();
  // Counter, not a boolean: with concurrent requests one op's finalize must not
  // clear the flag while another is still running.
  readonly loading = computed(() => this._inFlight() > 0);
  readonly search = this._search.asReadonly();
  readonly priority = this._priority.asReadonly();

  private readonly filteredTasks = computed<ITask[]>(() => {
    const priority = this._priority();
    const query = this._search().trim().toLowerCase();
    const useQuery = query.length >= SEARCH_MIN_LENGTH;

    return this._tasks().filter(task => {
      const matchesPriority = priority === 'all' || task.priority === priority;
      const matchesQuery = !useQuery || task.title.toLowerCase().includes(query);
      return matchesPriority && matchesQuery;
    });
  });

  readonly totalTasks = computed(() => this.filteredTasks().length);
  readonly columnsCount = computed(
    () => new Set(this.filteredTasks().map(task => task.status)).size,
  );

  readonly columns = computed<IBoardColumn[]>(() => {
    // Pre-seed every status so empty columns stay visible in fixed order.
    const byStatus = new Map<TaskStatus, ITask[]>(
      TASK_STATUS_ORDER.map(status => [status, []]),
    );

    for (const task of this.filteredTasks()) {
      byStatus.get(task.status)?.push(task);
    }

    return TASK_STATUS_ORDER.map(status => ({
      status,
      tasks: byStatus.get(status) ?? [],
    }));
  });

  setSearch(value: string): void {
    this._search.set(value);
  }

  setPriority(priority: PriorityFilter): void {
    this._priority.set(priority);
  }

  private beginRequest(): void {
    this._inFlight.update(count => count + 1);
  }

  private endRequest(): void {
    this._inFlight.update(count => Math.max(0, count - 1));
  }

  load(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId == null) {
      return;
    }

    this.beginRequest();

    this.tasksService
      .getForUser(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.endRequest()),
      )
      .subscribe({
        next: tasks => this._tasks.set(tasks),
        // Reported by errorInterceptor (global banner); swallow so it doesn't
        // escalate to Angular's ErrorHandler.
        error: () => {},
      });
  }

  // Returns the request so the caller (modal form) can close / show errors.
  addTask(input: NewTaskInput): Observable<ITask> {
    const userId = this.authService.getCurrentUserId();
    if (userId == null) {
      return EMPTY;
    }

    this.beginRequest();

    return this.tasksService
      .createTask({...input, userId})
      .pipe(
        tap(() => this.load()),
        finalize(() => this.endRequest()),
        takeUntilDestroyed(this.destroyRef),
      );
  }

  deleteTask(id: string): void {
    this.beginRequest();

    this.tasksService
      .deleteTask(id)
      .pipe(
        finalize(() => this.endRequest()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.load(),
        error: () => {},
      });
  }

  updateTaskStatus(id: string, status: TaskStatus): void {
    this.beginRequest();

    this.tasksService
      .updateStatus(id, status)
      .pipe(
        finalize(() => this.endRequest()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.load(),
        error: () => {},
      });
  }
}
