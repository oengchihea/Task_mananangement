import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [class.completed]="task.completed" [class.important]="task.important">
      <div class="task-content">
        <div class="task-checkbox-wrapper">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="toggleComplete.emit(task.id)"
            class="task-checkbox"
            [id]="'task-' + task.id"
          >
          <label [for]="'task-' + task.id" class="checkbox-label">
            <i class="fas fa-check"></i>
          </label>
        </div>
        <div class="task-details">
          <span class="task-title">{{ task.title }}</span>
          <div class="task-meta">
            <span class="task-date">
              <i class="fas fa-calendar-alt"></i>
              Created: {{ formatDate(task.createdAt) }}
            </span>
            <span class="task-deadline" *ngIf="task.deadline">
              <i class="fas fa-clock"></i>
              Due: {{ formatDate(task.deadline) }}
            </span>
          </div>
        </div>
      </div>

      <div class="task-actions">
        <button
          (click)="editTask.emit(task)"
          class="edit-btn"
          title="Edit task"
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          (click)="toggleImportant.emit(task.id)"
          class="important-btn"
          [class.active]="task.important"
          title="Mark as important"
        >
          <i class="fas fa-star"></i>
        </button>
        <button
          class="delete-btn"
          (click)="deleteTask.emit(task.id)"
          title="Delete task"
        >
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() toggleImportant = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
