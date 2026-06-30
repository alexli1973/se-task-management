import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  templateUrl: './infra-button.html',
  styleUrl: './infra-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfraButton {
  readonly label = input('');
  readonly type = input<ButtonType>('button');
  readonly size = input<ButtonSize>('medium');
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);

  readonly clicked = output<void>();

  protected readonly classes = computed(
    () => `infra-button infra-button--${this.size()} infra-button--${this.variant()}`,
  );
}
