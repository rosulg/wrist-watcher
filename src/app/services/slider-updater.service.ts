import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Sliders{
  zoom: Number;

}

@Injectable({
  providedIn: 'root'
})
export class SliderUpdaterService {

  private subject = new BehaviorSubject<Sliders>(null);

  constructor() { }

  observable: Observable<Sliders> = this.subject.asObservable();

  notify(value: Sliders): void {
    this.subject.next(value);
  }
}
