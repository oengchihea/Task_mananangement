import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  important: boolean;
  createdAt: Date;
  deadline?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  private loadTasks(): void {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          deadline: task.deadline ? new Date(task.deadline) : undefined
        }));
        this.tasksSubject.next(this.tasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
      this.tasksSubject.next(this.tasks);
    }
  }

  private saveTasks(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.tasksSubject.next(this.tasks);
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(title: string, deadline?: Date): Observable<Task> {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      important: false,
      createdAt: new Date(),
      deadline
    };
    this.tasks.push(newTask);
    this.saveTasks();
    return new BehaviorSubject(newTask).asObservable();
  }

  updateTask(taskId: number, updates: Partial<Task>): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.saveTasks();
    }
    return new BehaviorSubject(task).asObservable();
  }

  toggleComplete(taskId: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
    return new BehaviorSubject(task).asObservable();
  }

  toggleImportant(taskId: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.important = !task.important;
      this.saveTasks();
    }
    return new BehaviorSubject(task).asObservable();
  }

  deleteTask(taskId: number): Observable<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    return new BehaviorSubject(this.tasks.length < initialLength).asObservable();
  }
}
