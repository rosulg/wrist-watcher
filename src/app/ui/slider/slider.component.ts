import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatSliderChange} from '@angular/material';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Output() sliderChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChange(event: MatSliderChange): void {
    this.sliderChanged.emit(event.value);
  }

}
