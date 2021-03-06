import 'hammerjs';
import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {EngineComponent} from './engine/engine.component';
import {UiInfobarBottomComponent} from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import {UiInfobarTopComponent} from './ui/ui-infobar-top/ui-infobar-top.component';
import {UiSidebarLeftComponent} from './ui/ui-sidebar-left/ui-sidebar-left.component';
import {UiSidebarRightComponent} from './ui/ui-sidebar-right/ui-sidebar-right.component';
import {UiComponent} from './ui/ui.component';
import {GestureConfig, MatFormFieldModule, MatInputModule, MatListModule, MatSidenavModule, MatSliderModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig,
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
