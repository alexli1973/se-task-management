import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

let nextId = 0;

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input',
  templateUrl: './infra-input.html',
  styleUrl: './infra-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InfraInput),
      multi: true,
    },
  ],
})
export class InfraInput implements ControlValueAccessor {
  readonly label = input('');
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);
  readonly error = input<string | null>(null);
  // Reserve vertical space for the error line (keeps forms from jumping).
  // Disable for standalone, non-validated inputs like the search box.
  readonly reserveError = input(true);

  protected readonly inputId = `app-input-${nextId++}`;

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly revealed = signal(false);
  protected readonly focused = signal(false);

  protected readonly inputType = computed<InputType>(() =>
    this.type() === 'password' && this.revealed() ? 'text' : this.type(),
  );

  /** Show the error only when the field is invalid and NOT focused. */
  protected readonly showError = computed(() => !!this.error() && !this.focused());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected toggleReveal(): void {
    this.revealed.update((revealed) => !revealed);
  }

  protected onInput(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
