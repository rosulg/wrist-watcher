import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: []
})
export class UiSidebarLeftComponent implements OnInit {

  message:number;

  constructor(private data: EngineService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }

  front(){
    this.data.changeMessage(5)
  }

  back(){
    this.data.changeMessage(-7)
  }

}
