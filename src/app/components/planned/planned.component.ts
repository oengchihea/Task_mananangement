import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface PlannedNote {
  id: string;
  content: string;
  color: string;
  created: Date;
}

interface DayColumn {
  day: string;
  notes: PlannedNote[];
}

@Component({
  selector: 'app-planned',
  templateUrl: './planned.component.html',
  styleUrls: ['./planned.component.css'],
  standalone: true,
  imports: [CommonModule, DragDropModule]
})
export class PlannedComponent implements OnInit {
  days: DayColumn[] = [
    { day: 'Monday', notes: [] },
    { day: 'Tuesday', notes: [] },
    { day: 'Wednesday', notes: [] },
    { day: 'Thursday', notes: [] },
    { day: 'Friday', notes: [] }
  ];

  noteColors = ['#4299e1', '#48bb78', '#f6ad55', '#f56565', '#9f7aea'];

  constructor() {}

  ngOnInit(): void {
    const savedNotes = localStorage.getItem('plannedNotes');
    if (savedNotes) {
      this.days = JSON.parse(savedNotes);
    }
  }

  addNote(dayIndex: number): void {
    const content = prompt('Enter note content:');
    if (content) {
      const newNote: PlannedNote = {
        id: Date.now().toString(),
        content,
        color: this.noteColors[Math.floor(Math.random() * this.noteColors.length)],
        created: new Date()
      };
      this.days[dayIndex].notes.push(newNote);
      this.saveNotes();
    }
  }

  deleteNote(dayIndex: number, noteIndex: number): void {
    this.days[dayIndex].notes.splice(noteIndex, 1);
    this.saveNotes();
  }

  drop(event: CdkDragDrop<PlannedNote[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.saveNotes();
  }

  getConnectedList(): string[] {
    return this.days.map((_, i) => `list-${i}`);
  }

  private saveNotes(): void {
    localStorage.setItem('plannedNotes', JSON.stringify(this.days));
  }
}
