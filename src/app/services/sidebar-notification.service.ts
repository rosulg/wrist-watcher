import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface SidebarAction {
  rotate?: boolean;
  forward?: boolean;
  backward?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarNotificationService {

  private subject = new BehaviorSubject<SidebarAction>(null);

  constructor() { }

  observable: Observable<SidebarAction> = this.subject.asObservable();

  notify(value: SidebarAction): void {
    console.log('notify:', value)
    this.subject.next(value);
  }
}
