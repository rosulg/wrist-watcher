import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {
  loading = true;

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engServ: EngineService) { }

  async ngOnInit() {
    await this.engServ.createScene(this.rendererCanvas);
    await this.engServ.animate();
    this.loading = false;
  }

}
