import {ChangeDetectionStrategy, Component, input} from '@angular/core';

type SpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-infra-spinner',
  templateUrl: './infra-spinner.html',
  styleUrl: './infra-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfraSpinner {
  readonly size = input<SpinnerSize>('medium');
}
