import { ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';

import { DialogueTurnComponent } from '../shared/dialogue-turn/dialogue-turn.component';

export class PersonalComponent implements OnInit, AfterViewInit {
  @ViewChildren(DialogueTurnComponent)
  private turns: QueryList<DialogueTurnComponent>;

  /**
   * The state of the whole component.
   * When there is no interaction possible anymore.
   */
  isDisabled: boolean;

  constructor() { }

  /**
   * Angular default component initialisation
   */
  ngOnInit() {
  }

  ngAfterViewInit() {
    // Delay appearance of each turn so it feels more like a 'natural' conversation.
    this.turns.forEach((turn, index) => {
      window.setTimeout(() => {
        turn.isSpoken = true;
      }, 300 * (index + 1));
    });
  }

  /**
   * Show a specific, previously hidden, Dialogue-Turn
   */
  showTurn(index: number) {
    const turn = this.turns.toArray()[index];

    if (turn) {
      turn.isSpoken = true;
    }
  }

  /**
   * Provide the name of the next section to be loaded/shown.
   * This can contain logic to base the decision on user input, etc.
   */
  getNextSection(): string {
    return '';
  }

  /**
   * Mark the component as 'done'.
   * This should include a call to `this.conversationService.onSectionCompleted()`
   */
  complete(): void {

  }
}