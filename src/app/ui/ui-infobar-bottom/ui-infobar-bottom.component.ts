import {Component} from '@angular/core';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';

@Component({
  selector: 'app-ui-infobar-bottom',
  templateUrl: './ui-infobar-bottom.component.html',
  styleUrls: ['./ui-infobar-bottom.component.scss']
})
export class UiInfobarBottomComponent {

  constructor(private sidebarNotificationService: SidebarNotificationService) { }

  minHandCircumference = 14;
  maxHandCircumference = 24;

  minWatchLugWidth = 32;
  maxWatchLugWidth = 50;

  defaultHandCircumference = 17.5;
  defaultHandHeight = this.defaultHandCircumference * 0.35;
  defaultWatchLugWidth = this.defaultHandHeight * 0.65 * 10;

  initRatio = this.defaultHandCircumference / this.defaultWatchLugWidth;
  ratio;

  lastHandCircumference = this.defaultHandCircumference;
  lastWatchLugWidth = this.defaultWatchLugWidth;

  onHandCircumferenceChanged(event): void {
    const value = +event.target.value;
    if (value >= this.minHandCircumference && value <= this.maxHandCircumference) {
      this.ratio = value / this.lastWatchLugWidth;
      this.lastHandCircumference = value;

      this.sizeHand();
    }
  }

  onWatchLugWidthChanged(event): void {
    const value = +event.target.value;
    if (value >= this.minWatchLugWidth && value <= this.maxWatchLugWidth) {
      this.ratio = this.lastHandCircumference / value;
      this.lastWatchLugWidth = value;

      this.sizeHand();
    }
  }

  private sizeHand(): void {
    const handScaleSize = this.ratio / this.initRatio;
    this.sidebarNotificationService.notify({ handScaleSize });
  }

}
