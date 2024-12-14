import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Task</h2>
          <button class="close-btn" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="editTitle">Title</label>
            <input
              type="text"
              id="editTitle"
              [(ngModel)]="editedTitle"
              class="form-input"
              placeholder="Task title"
            >
          </div>
          <div class="form-group">
            <label for="editDeadline">Deadline</label>
            <input
              type="datetime-local"
              id="editDeadline"
              [(ngModel)]="editedDeadline"
              class="form-input"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" (click)="close()">Cancel</button>
          <button class="save-btn" (click)="save()">Save Changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-secondary);
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-primary);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px var(--accent-color-alpha);
    }

    .modal-footer {
      padding: 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .cancel-btn,
    .save-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cancel-btn {
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .cancel-btn:hover {
      background: var(--bg-active);
    }

    .save-btn {
      background: var(--accent-color);
      border: none;
      color: white;
    }

    .save-btn:hover {
      background: var(--accent-hover);
    }
  `]
})
export class EditTaskModalComponent implements OnInit {
  @Input() task?: Task;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<{title: string, deadline?: Date}>();

  editedTitle = '';
  editedDeadline?: string;

  ngOnInit() {
    if (this.task) {
      this.editedTitle = this.task.title;
      this.editedDeadline = this.task.deadline ?
        new Date(this.task.deadline.getTime() - this.task.deadline.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16) : undefined;
    }
  }

  close() {
    this.closeModal.emit();
  }

  save() {
    if (this.editedTitle.trim()) {
      this.saveChanges.emit({
        title: this.editedTitle,
        deadline: this.editedDeadline ? new Date(this.editedDeadline) : undefined
      });
    }
  }
}
