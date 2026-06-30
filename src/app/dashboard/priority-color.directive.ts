import {Directive, computed, input} from '@angular/core';
import {TaskPriority} from './task.models';

// Sets the `--priority-color` CSS variable on the host based on the task priority.
// Consumers paint with var(--priority-color): the card stripe, the label dot, etc.
@Directive({
  selector: '[appPriorityColor]',
  host: {
    '[style.--priority-color]': 'color()',
  },
})
export class PriorityColorDirective {
  // Priority is bound through the directive's own selector
  readonly priority = input.required<TaskPriority>({alias: 'appPriorityColor'});

  // Resolves to a color token defined in _colors.scss (--priority-high, etc.)
  protected readonly color = computed(() => `var(--priority-${this.priority()})`);
}
