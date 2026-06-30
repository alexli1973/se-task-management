import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Header} from './header/header';
import {PrioritySelect} from './priority-select/priority-select';
import {Board} from './board/board';
import {AuthService} from '../auth/auth.service';
import {TaskStore} from './task.store';
import {PriorityFilter} from './task.models';
import {InfraInput} from '../shared/infra-input/infra-input';
import {InfraSpinner} from '../shared/infra-spinner/infra-spinner';
import {FILTERS_TEXTS} from '../core/constants/texts.constants';
import {InfraModal} from '../shared/infra-modal/infra-modal';
import {NewTaskForm} from './new-task-form/new-task-form';

@Component({
  selector: 'app-dashboard',
  imports: [
    Header,
    PrioritySelect,
    Board,
    InfraInput,
    InfraSpinner,
    FormsModule,
    InfraModal,
    NewTaskForm,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Scoped to Dashboard: Board/Card inject this same instance, gone on teardown.
  providers: [TaskStore],
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly store = inject(TaskStore);

  protected readonly user = computed(() => this.authService.session());

  protected readonly totalTasks = this.store.totalTasks;
  protected readonly columnsCount = this.store.columnsCount;

  protected readonly search = this.store.search;
  protected readonly searchPlaceholder = FILTERS_TEXTS.searchPlaceholder;

  protected readonly priority = this.store.priority;
  protected readonly priorityLabel = FILTERS_TEXTS.priorityLabel;

  protected readonly loading = this.store.loading;

  protected readonly isCreateTaskModalOpen = signal(false);

  protected onSearch(value: string): void {
    this.store.setSearch(value);
  }

  protected onPriority(value: PriorityFilter): void {
    this.store.setPriority(value);
  }

  protected onLogout(): void {
    this.authService.logout();
  }

  protected onNewTask(): void {
    this.isCreateTaskModalOpen.set(true);
  }

  protected closeCreateTaskModal(): void {
    this.isCreateTaskModalOpen.set(false);
  }

  ngOnInit(): void {
    this.store.load();
  }
}
