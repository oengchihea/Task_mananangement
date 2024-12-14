import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  reminder: string;
  completed: boolean;
  category: string;
  completedAt?: Date;
  progress: number;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

@Component({
  selector: 'app-important',
  templateUrl: './important.component.html',
  styleUrls: ['./important.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule]
})
export class ImportantComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  taskStats: TaskStats = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  };
  categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
  selectedCategory = 'all';
  selectedPriority = 'all';
  showCompleted = true;

  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    reminder: '',
    completed: false,
    category: 'Other',
    progress: 0
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [0, 0, 0]
    }]
  };
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Tasks Completed' }
    ]
  };

  constructor() {}

  ngOnInit(): void {
    this.loadTasks();
    this.updateTaskStats();
    this.updateCharts();
  }

  loadTasks(): void {
    const savedTasks = localStorage.getItem('importantTasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      this.applyFilters();
    }
  }

  updateCharts(): void {
    this.updatePieChart();
    this.updateBarChart();
  }

  updatePieChart(): void {
    const progressData = this.getProgressData();
    this.pieChartData.datasets[0].data = progressData;
    this.chart?.update();
  }

  updateBarChart(): void {
    const weeklyData = this.getWeeklyCompletionData();
    this.barChartData.labels = this.getLastSevenDays();
    this.barChartData.datasets[0].data = weeklyData;
    this.chart?.update();
  }

  getProgressData(): number[] {
    const completed = this.tasks.filter(t => t.completed).length;
    const inProgress = this.tasks.filter(t => !t.completed && t.progress > 0).length;
    const notStarted = this.tasks.filter(t => !t.completed && t.progress === 0).length;
    return [completed, inProgress, notStarted];
  }

  getLastSevenDays(): string[] {
    return Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();
  }

  getWeeklyCompletionData(): number[] {
    return Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return this.tasks.filter(task => {
        const completedDate = task.completedAt ? new Date(task.completedAt) : null;
        return completedDate && completedDate.getTime() >= date.getTime() &&
               completedDate.getTime() < date.getTime() + 86400000;
      }).length;
    }).reverse();
  }

  addTask(): void {
    if (this.newTask.title.trim()) {
      this.newTask.id = Date.now();
      this.tasks.push({ ...this.newTask });
      this.saveTasks();
      this.resetNewTask();
      this.updateTaskStats();
      this.updateCharts();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.updateTaskStats();
    this.updateCharts();
  }

  toggleTaskComplete(task: Task): void {
    task.completed = !task.completed;
    if (task.completed) {
      task.completedAt = new Date();
      task.progress = 100;
    } else {
      task.completedAt = undefined;
    }
    this.saveTasks();
    this.updateTaskStats();
    this.updateCharts();
  }

  updateTaskProgress(task: Task, progress: number): void {
    task.progress = progress;
    if (progress === 100) {
      task.completed = true;
      task.completedAt = new Date();
    }
    this.saveTasks();
    this.updateTaskStats();
    this.updateCharts();
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const categoryMatch = this.selectedCategory === 'all' || task.category === this.selectedCategory;
      const priorityMatch = this.selectedPriority === 'all' || task.priority === this.selectedPriority;
      const completedMatch = this.showCompleted || !task.completed;
      return categoryMatch && priorityMatch && completedMatch;
    });
  }

  updateTaskStats(): void {
    const now = new Date();
    this.taskStats = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length,
      overdue: this.tasks.filter(t => {
        const deadline = new Date(t.deadline);
        return !t.completed && deadline < now;
      }).length
    };
  }

  private saveTasks(): void {
    localStorage.setItem('importantTasks', JSON.stringify(this.tasks));
    this.applyFilters();
  }

  private resetNewTask(): void {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
      reminder: '',
      completed: false,
      category: 'Other',
      progress: 0
    };
  }
}

