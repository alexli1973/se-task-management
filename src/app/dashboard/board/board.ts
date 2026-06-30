import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Card} from '../card/card';
import {TaskStore} from '../task.store';
import {BOARD_TEXTS} from '../../core/constants/texts.constants';

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrl: './board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
  ],
})
export class Board {
  private readonly store = inject(TaskStore);

  // Pre-grouped columns straight from the feature store
  protected readonly columns = this.store.columns;

  // Column labels resolved in the view (data layer stays i18n-free)
  protected readonly texts = BOARD_TEXTS;
}
