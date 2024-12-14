import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

interface AssignedTask {
  id: string;
  content: string;
  color: string;
  created: Date;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface TaskColumn {
  status: string;
  title: string;
  tasks: AssignedTask[];
}

@Component({
  selector: 'app-assigned',
  templateUrl: './assigned.component.html',
  styleUrls: ['./assigned.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule]
})
export class AssignedComponent implements OnInit {
  columns: TaskColumn[] = [
    { status: 'pending', title: 'To Do', tasks: [] },
    { status: 'in-progress', title: 'In Progress', tasks: [] },
    { status: 'completed', title: 'Completed', tasks: [] }
  ];

  taskColors = {
    low: '#4299e1',
    medium: '#f6ad55',
    high: '#f56565'
  };

  newTask = {
    content: '',
    assignTo: '',
    dueDate: new Date(),
    priority: 'medium' as const
  };

  showNewTaskForm = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedTasks = localStorage.getItem('assignedTasks');
    if (savedTasks) {
      this.columns = JSON.parse(savedTasks);
    }
  }

  toggleNewTaskForm(): void {
    this.showNewTaskForm = !this.showNewTaskForm;
    if (!this.showNewTaskForm) {
      this.resetNewTaskForm();
    }
  }

  addTask(): void {
    if (this.newTask.content && this.newTask.assignTo) {
      const currentUser = this.authService.currentUserValue;

      const newTask: AssignedTask = {
        id: Date.now().toString(),
        content: this.newTask.content,
        color: this.taskColors[this.newTask.priority],
        created: new Date(),
        assignedTo: this.newTask.assignTo,
        assignedBy: currentUser?.email || 'Unknown',
        dueDate: this.newTask.dueDate,
        priority: this.newTask.priority,
        status: 'pending'
      };

      this.columns[0].tasks.push(newTask);
      this.saveTasks();
      this.resetNewTaskForm();
      this.showNewTaskForm = false;
    }
  }

  deleteTask(columnIndex: number, taskIndex: number): void {
    this.columns[columnIndex].tasks.splice(taskIndex, 1);
    this.saveTasks();
  }

  drop(event: CdkDragDrop<AssignedTask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status based on new column
      const task = event.container.data[event.currentIndex];
      const newStatus = this.columns.find(col => col.tasks === event.container.data)?.status;
      if (task && newStatus) {
        task.status = newStatus as any;
      }
    }
    this.saveTasks();
  }

  getConnectedList(): string[] {
    return this.columns.map((_, i) => `list-${i}`);
  }

  private resetNewTaskForm(): void {
    this.newTask = {
      content: '',
      assignTo: '',
      dueDate: new Date(),
      priority: 'medium'
    };
  }

  private saveTasks(): void {
    localStorage.setItem('assignedTasks', JSON.stringify(this.columns));
  }
}

