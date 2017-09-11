import { Component } from '@stencil/core';

@Component({
  tag: 'snack-bar',
  styleUrl:'snack-bar.scss'  
})

export class SnackBar {
  render() {
    return(
      <div class="mdc-snackbar"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden="true">
        <div class="mdc-snackbar__text"></div>
        <div class="mdc-snackbar__action-wrapper">
          <button type="button" class="mdc-button mdc-snackbar__action-button"></button>
        </div>
      </div>
    );
  }
}