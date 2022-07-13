import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { UsersViewComponent } from './users/users-view';
import { UsersCreateComponent } from './users/users-create';
import { UsersUpdateComponent } from './users/users-update';
import { CategoriesViewComponent } from './categories/categories-view';
import { CategoriesUpdateComponent } from './categories/categories-update';
import { CategoriesCreateComponent } from './categories/categories-create';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { NgxPaginationModule } from 'ngx-pagination';;
import { AppointmentsEmployeeComponent } from './appointments-employee/appointments-employee.component'


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ]);

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FullCalendarModule,
        NgxPaginationModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        UsersViewComponent,
        UsersCreateComponent,
        UsersUpdateComponent,
        CategoriesViewComponent ,
        CategoriesCreateComponent,
        CategoriesUpdateComponent,
        AppointmentsEmployeeComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }