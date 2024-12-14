import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { TaskService } from './app/services/task.service';
import { ThemeService } from './app/services/theme.services';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    TaskService,
    ThemeService,
    importProvidersFrom(BrowserAnimationsModule), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));

