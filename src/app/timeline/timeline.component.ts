import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Event {
  id: number;
  date: Date;
  person: string;
  description: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule
  ]
})
export class TimelineComponent implements OnInit, AfterViewInit {
  events: Event[] = [];
  displayedColumns: string[] = ['date', 'person', 'description', 'actions'];
  @ViewChild('timelineContent') timelineContent!: ElementRef;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // Initialize with some example events
    this.events = [
      { id: 1, date: new Date('2022-01-15T06:20:00'), person: 'Luis', description: 'Salió de casa' },
      { id: 2, date: new Date('2022-01-15T06:30:00'), person: 'Pamela', description: 'dos hombres subieron a un muchacho a una camioneta tipo van' },
      { id: 3, date: new Date('2022-01-15T07:00:00'), person: 'Luis', description: 'Manda un mensaje' },
      { id: 4, date: new Date('2022-01-15T11:00:00'), person: 'Pamela', description: 'Enviarle mensaje' },
      { id: 5, date: new Date('2022-01-15T11:40:00'), person: 'Juan', description: 'Marqué a mi hermano' },
      { id: 6, date: new Date('2022-01-15T11:45:00'), person: 'Nadia', description: 'Llegó' },
      { id: 7, date: new Date('2022-01-15T12:07:00'), person: 'Alicia', description: 'Casa de la vecina' },
      { id: 8, date: new Date('2022-01-15T13:05:00'), person: 'Público', description: 'Aparece del ministerio' },
    ];
    this.sortEvents();
  }

  ngAfterViewInit() {
    this.adjustTimelineWidth();
  }

  openDialog() {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '250px',
      data: { date: new Date(), person: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(result);
      }
    });
  }

  addEvent(event: Event) {
    event.id = this.events.length + 1;
    this.events.push(event);
    this.sortEvents();
    setTimeout(() => this.adjustTimelineWidth(), 0);
  }

  deleteEvent(event: Event) {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index > -1) {
      this.events.splice(index, 1);
      this.sortEvents();
      setTimeout(() => this.adjustTimelineWidth(), 0);
    }
  }

  sortEvents() {
    this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getEventPosition(event: Event): string {
    if (this.events.length < 2) return '0%';
    const startTime = this.events[0].date.getTime();
    const endTime = this.events[this.events.length - 1].date.getTime();
    const eventTime = event.date.getTime();
    const position = ((eventTime - startTime) / (endTime - startTime)) * 100;
    return `${position}%`;
  }

  adjustTimelineWidth() {
    if (this.events.length < 2) return;
    const startTime = this.events[0].date.getTime();
    const endTime = this.events[this.events.length - 1].date.getTime();
    const timeSpan = endTime - startTime;
    const minWidth = this.timelineContent.nativeElement.offsetWidth;
    const desiredWidth = Math.max(minWidth, timeSpan / (1000 * 60 * 5)); // 5 minutes per pixel
    this.timelineContent.nativeElement.style.width = `${desiredWidth}px`;
  }
}

@Component({
  selector: 'app-event-dialog',
  template: `
    <h1 mat-dialog-title>Add New Event</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="data.date">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Person</mat-label>
        <input matInput [(ngModel)]="data.person">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <input matInput [(ngModel)]="data.description">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Save</button>
    </div>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatButtonModule
  ]
})
export class EventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}