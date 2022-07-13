import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { UsersUpdateComponent } from './users/users-update';
import { CategoriesViewComponent } from './categories/categories-view';
import { CategoriesUpdateComponent } from './categories/categories-update';
import { CategoriesCreateComponent } from './categories/categories-create';
import { AdminGuard, AuthGuard } from './_helpers';
import { AppointmentsEmployeeComponent } from './appointments-employee/appointments-employee.component';
import { RegisterComponent } from './register';
import { UsersCreateComponent } from './users/users-create';
import { UsersViewComponent } from './users/users-view';


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'users', component: UsersViewComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'users/update/:id', component: UsersUpdateComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'users/create', component: UsersCreateComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'categories', component: CategoriesViewComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'categories/update/:id', component: CategoriesUpdateComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'categories/create', component: CategoriesCreateComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'appointments/:id', component: AppointmentsEmployeeComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
