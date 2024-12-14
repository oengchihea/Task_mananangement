import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  implemented: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { path: '/my-day', icon: 'fas fa-calendar-day', label: 'My Day', implemented: true },
    { path: '/important', icon: 'fas fa-star', label: 'Important', implemented: true },
    { path: '/planned', icon: 'fas fa-calendar', label: 'Planned', implemented: true },
    { path: '/assigned', icon: 'fas fa-user', label: 'Assigned to me', implemented: true },
    { path: '/tasks', icon: 'fas fa-tasks', label: 'Tasks', implemented: true },
  ];

  handleClick(event: MouseEvent, implemented: boolean) {
    if (!implemented) {
      event.preventDefault();
      window.alert('This feature is coming soon!');
    }
  }
}

