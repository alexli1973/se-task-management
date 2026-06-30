import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpErrorStateService} from './core/api/http-error-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('se-task-management');
  protected readonly httpErrorState = inject(HttpErrorStateService);

  protected closeHttpError(): void {
    this.httpErrorState.clear();
  }

}
