import {ChangeDetectionStrategy, Component, computed, input, model} from '@angular/core';
import {PriorityFilter} from '../task.models';
import {BOARD_TEXTS, FILTERS_TEXTS} from '../../core/constants/texts.constants';

@Component({
  selector: 'app-priority-select',
  imports: [],
  standalone: true,
  templateUrl: './priority-select.html',
  styleUrl: './priority-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrioritySelect {
  readonly value = model<PriorityFilter>('all');

  readonly includeAll = input(false);

  readonly label = input('');

  protected readonly options = computed<readonly PriorityFilter[]>(() =>
    this.includeAll() ? ['all', 'high', 'medium', 'low'] : ['high', 'medium', 'low'],
  );

  protected labelFor(priority: PriorityFilter): string {
    return priority === 'all' ? FILTERS_TEXTS.all : BOARD_TEXTS.priorities[priority];
  }

  protected select(priority: PriorityFilter): void {
    this.value.set(priority);
  }
}
