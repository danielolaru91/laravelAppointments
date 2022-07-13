import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, UserService } from './_services';

import { CategoryService } from './_services';

import { User } from './_models';

import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'] })
export class AppComponent {

    loading: any;
    currentUser: User;
    categories: any;
    employees: User[];
    isLoggedIn: any;
    category:any;

    isLoggedInAsAdmin: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private categoryService: CategoryService,
        private userService: UserService,
        private http: HttpClient
    ) { 
        this.loading = true;
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.isLoggedIn = this.authenticationService.currentUserValue;

        if(localStorage.getItem('currentUser')){
            this.isLoggedInAsAdmin = JSON.parse(localStorage.getItem('currentUser')).user.role == 'Admin';
        }
        
        if(this.isLoggedIn){

            if(!this.isLoggedInAsAdmin){
                this.router.navigate(['/appointments/' + JSON.parse(localStorage.getItem('currentUser')).user.id]);
            }

            this.categoryService.getAll().subscribe(categories => {
                this.categories = categories;
    
                this.categoryService.setCategoriesObs(this.categories);
                this.categoryService.getCategoriesObs().subscribe(categories => {
                    this.categories = categories;
                });
    
                this.loading = false;
            });
    
            this.userService.getAllEmployees().pipe(first()).subscribe(employees => {
                this.employees = employees;
    
                this.userService.setEmployeesObs(this.employees);
                this.userService.getEmployeesObs().subscribe(employees => {
                    this.employees = employees;
                });
                
            });
        }

        this.loading = false;


    }

    logout() {
        if(confirm("Sunteti sigur ca doriti sa parasiti aplicatia ?")) {
            this.authenticationService.logout();
            window.location.href="/login"
        }
    }
}