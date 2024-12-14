import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { MyDayComponent } from './components/my-day/my-day.component';
import { ImportantComponent } from './components/important/important.component';
import { PlannedComponent } from './components/planned/planned.component';
import { AssignedComponent } from './components/assigned/assigned.component';

export const routes: Routes = [
  { path: '', redirectTo: '/my-day', pathMatch: 'full' },
  { path: 'my-day', component: MyDayComponent },
  { path: 'important', component: ImportantComponent },
  { path: 'planned', component: PlannedComponent },
  { path: 'assigned', component: AssignedComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '/my-day' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

