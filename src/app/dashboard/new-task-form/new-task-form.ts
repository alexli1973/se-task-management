import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskStore} from '../task.store';
import {PriorityFilter, TASK_STATUS_ORDER, TaskPriority, TaskStatus} from '../task.models';
import {BOARD_TEXTS, NEW_TASK_TEXTS} from '../../core/constants/texts.constants';
import {InfraInput} from '../../shared/infra-input/infra-input';
import {InfraButton} from '../../shared/infra-button/infra-button';
import {PrioritySelect} from '../priority-select/priority-select';

@Component({
  selector: 'app-new-task-form',
  imports: [
    ReactiveFormsModule,
    InfraInput,
    InfraButton,
    PrioritySelect,
  ],
  templateUrl: './new-task-form.html',
  styleUrl: './new-task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskForm {
  private readonly store = inject(TaskStore);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly texts = NEW_TASK_TEXTS;
  protected readonly statusLabels = BOARD_TEXTS.columns;
  protected readonly statusOptions = TASK_STATUS_ORDER;
  protected readonly loading = this.store.loading;

  readonly created = output<void>();
  readonly cancel = output<void>();

  protected readonly form = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: [''],
    status: ['todo' as TaskStatus, [Validators.required]],
    priority: ['medium' as TaskPriority, [Validators.required]],
  });

  // No "all" chip here, so the value is always a concrete TaskPriority.
  protected onPriority(priority: PriorityFilter): void {
    this.form.controls.priority.setValue(priority as TaskPriority);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.addTask(this.form.getRawValue()).subscribe({
      next: () => this.created.emit(),
      // Keep the modal open on failure; errorInterceptor already showed the banner.
      error: () => {},
    });
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
