import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-infra-modal',
  imports: [],
  standalone: true,
  templateUrl: './infra-modal.html',
  styleUrl: './infra-modal.scss',
})
export class InfraModal {
  readonly title = input.required<string>();
  readonly close = output<void>();

  protected onClose(): void {
    this.close.emit();
  }
}
