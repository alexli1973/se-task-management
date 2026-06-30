import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {IAuthSession} from '../../auth/auth.models';
import {InfraButton} from '../../shared/infra-button/infra-button';
import {DASHBOARD_TEXTS} from '../../core/constants/texts.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InfraButton
  ]
})
export class Header {
  protected readonly texts = DASHBOARD_TEXTS;

  // Current user, passed down from the Dashboard container
  readonly user = input<IAuthSession | null>(null);

  // Pre-computed counts, passed down from the Dashboard container (dumb component)
  readonly totalTasks = input<number>(0);
  readonly columnsCount = input<number>(0);

  // Notify the container about user actions
  readonly logout = output<void>();
  readonly newTask = output<void>();

  // Derive initials from the user's name, e.g. "Alice Johnson" -> "AJ"
  protected readonly initials = computed(() => {
    const name = this.user()?.name?.trim();
    if (!name) {
      return '';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('');
  });
}
