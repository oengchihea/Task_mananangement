import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list">
      <div class="add-task">
        <div class="input-group">
          <i class="fas fa-tasks input-icon"></i>
          <input
            [(ngModel)]="newTaskTitle"
            (keyup.enter)="addTask()"
            placeholder="Add a new task"
            class="task-input"
          >
        </div>
        <div class="input-group">
          <i class="fas fa-calendar-alt input-icon"></i>
          <input
            type="datetime-local"
            [(ngModel)]="newTaskDeadline"
            class="deadline-input"
          >
        </div>
        <button (click)="addTask()" class="add-button">
          <i class="fas fa-plus"></i>
          Add Task
        </button>
      </div>

      <div class="tasks-section">
        <h2 class="section-title">
          <i class="fas fa-list"></i>
          Active Tasks
        </h2>
        <div class="tasks-container">
          <app-task-item
            *ngFor="let task of activeTasks"
            [task]="task"
            (toggleComplete)="toggleComplete($event)"
            (toggleImportant)="toggleImportant($event)"
            (deleteTask)="deleteTask($event)"
            (editTask)="openEditModal($event)"
          ></app-task-item>
          <div *ngIf="activeTasks.length === 0" class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            No active tasks. Add a task to get started!
          </div>
        </div>
      </div>

      <div class="tasks-section" *ngIf="completedTasks.length > 0">
        <h2 class="section-title">
          <i class="fas fa-check-circle"></i>
          Completed Tasks
        </h2>
        <div class="tasks-container">
          <app-task-item
            *ngFor="let task of completedTasks"
            [task]="task"
            (toggleComplete)="toggleComplete($event)"
            (toggleImportant)="toggleImportant($event)"
            (deleteTask)="deleteTask($event)"
            (editTask)="openEditModal($event)"
          ></app-task-item>
        </div>
      </div>
    </div>

    <app-edit-task-modal
      *ngIf="isEditModalOpen"
      [task]="editingTask"
      (closeModal)="closeEditModal()"
      (saveChanges)="saveTaskChanges($event)"
    ></app-edit-task-modal>
  `,
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, FormsModule, TaskItemComponent, EditTaskModalComponent],
  standalone: true
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDeadline?: string;
  isEditModalOpen = false;
  editingTask?: Task;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  get activeTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(
        this.newTaskTitle,
        this.newTaskDeadline ? new Date(this.newTaskDeadline) : undefined
      ).subscribe(() => {
        this.newTaskTitle = '';
        this.newTaskDeadline = undefined;
        this.loadTasks();
      });
    }
  }

  openEditModal(task: Task) {
    this.editingTask = task;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingTask = undefined;
  }

  saveTaskChanges(changes: {title: string, deadline?: Date}) {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, changes).subscribe(() => {
        this.loadTasks();
        this.closeEditModal();
      });
    }
  }

  toggleComplete(taskId: number) {
    this.taskService.toggleComplete(taskId).subscribe(() => {
      this.loadTasks();
    });
  }

  toggleImportant(taskId: number) {
    this.taskService.toggleImportant(taskId).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
  }
}
