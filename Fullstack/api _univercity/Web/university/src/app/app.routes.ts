import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';
import { CoursesComponent } from './components/courses/courses';
import { LibraryComponent } from './components/library/library';
import { AuthGuard } from './guards/auth-guard';
import { GradesComponent } from './components/grades/grades';
import { ScheduleComponent } from './components/schedule/schedule';
import { ProfScheduleComponent } from './components/prof-schedule/prof-schedule';
import { ProfGradingComponent } from './components/prof-grading/prof-grading';
import { AdminUsersComponent } from './components/admin-users/admin-users';
import { AdminLibraryComponent } from './components/admin-library/admin-library';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    // ใช้ canActivate: [AuthGuard] เพื่อป้องกัน
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
    { path: 'library', component: LibraryComponent, canActivate: [AuthGuard] },
    { path: 'grades', component: GradesComponent, canActivate: [AuthGuard] },
    { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
    { path: 'prof-schedule', component: ProfScheduleComponent, canActivate: [AuthGuard] },
    { path: 'prof-grading', component: ProfGradingComponent, canActivate: [AuthGuard] },
    { path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard] },
    { path: 'admin-library', component: AdminLibraryComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login' } // URL มั่วๆ ให้เด้งไปหน้า login
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }