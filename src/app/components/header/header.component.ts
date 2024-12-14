import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from '../../services/theme.services';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, MatDialogModule],
  template: `
    <header class="app-header">
      <h1>To Do</h1>
      <div class="search-container">
        <input type="search" placeholder="Search tasks" class="search-input">
      </div>
      <div class="header-actions">
        <app-theme-toggle></app-theme-toggle>
        <ng-container *ngIf="!authService.isAuthenticated(); else loggedIn">
          <button (click)="openLoginDialog()" class="auth-button">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </button>
          <a routerLink="/register" class="auth-button">
            <i class="fas fa-user-plus"></i>
            Register
          </a>
        </ng-container>
        <ng-template #loggedIn>
          <button class="auth-button" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </ng-template>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private themeService: ThemeService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User logged in successfully');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

