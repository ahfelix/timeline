import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TimelineComponent } from './app/timeline/timeline.component';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimelineComponent],
  template: `
    <h1>Línea de Tiempo de Eventos</h1>
    <app-timeline></app-timeline>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
});