import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';
import { ThemeService } from '../../services/theme.services';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-my-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskListComponent
  ],
  template: `
    <div class="my-day-container" [class.dark]="isDarkMode">
      <header class="my-day-header">
        <div class="header-left">
          <h1>My Day</h1>
          <span class="date">{{ today | date:'EEEE, MMMM d' }}</span>
        </div>
      </header>

      <app-task-list></app-task-list>
    </div>
  `,
  styles: [`
    .my-day-container {
      padding: 2rem;
      background-color: var(--bg-primary);
      min-height: 100vh;
    }

    .my-day-header {
      margin-bottom: 2rem;
    }

    .header-left h1 {
      font-size: 1.875rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .header-left .date {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  `]
})
export class MyDayComponent implements OnInit {
  today = new Date();
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }
}

