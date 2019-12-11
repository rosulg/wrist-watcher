import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface SidebarAction {
  rotate: boolean;
  backward: boolean;
  x_hand_rotation: number;
  y_hand_rotation: number;
  z_hand_rotation: number;
  has_sliders: boolean;
  zoom: number;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarNotificationService {

  private subject = new BehaviorSubject<SidebarAction>(null);

  constructor() { }

  observable: Observable<SidebarAction> = this.subject.asObservable();

  notify(value: SidebarAction): void {
    this.subject.next(value);
  }
}
