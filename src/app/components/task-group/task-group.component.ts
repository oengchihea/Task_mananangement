import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-group',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() toggleImportant = new EventEmitter<number>();

  onToggleComplete(taskId: number) {
    this.toggleComplete.emit(taskId);
  }

  onToggleImportant(taskId: number) {
    this.toggleImportant.emit(taskId);
  }
}
