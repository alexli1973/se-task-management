import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {ITask, TaskStatus} from '../task.models';
import {PriorityColorDirective} from '../priority-color.directive';
import {BOARD_TEXTS} from '../../core/constants/texts.constants';
import {TaskStore} from '../task.store';
import {InfraButton} from '../../shared/infra-button/infra-button';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PriorityColorDirective,
    InfraButton,
  ],
})
export class Card {
  private readonly store = inject(TaskStore);

  // Single task, passed down from the Board
  readonly task = input.required<ITask>();

  // Hebrew label for the task's priority
  protected readonly priorityLabel = computed(() => BOARD_TEXTS.priorities[this.task().priority]);

  protected onDelete(): void {
    this.store.deleteTask(this.task().id);
  }

  protected onStatusChange(status: TaskStatus): void {
    this.store.updateTaskStatus(this.task().id, status);
  }
}
