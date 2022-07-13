import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';
import { CategoryService } from '@app/_services';

@Component({ templateUrl: 'users-create.component.html' })
export class UsersCreateComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    roles: any;
    categories: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private categoryService: CategoryService
    ) { 
 
    }

    ngOnInit() {

        this.roles = [
            {label: 'Admin', value: 'Admin'},
            {label: 'Employee', value: 'Employee'}
        ],

        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required],
            category_id: ['', Validators.required],
            role: ['', Validators.required],
        });

        this.categoryService.getAll().subscribe(categories => {
            this.categories = categories;
        });

    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        var reqBody = {
            name: this.f.name.value,
            category_id: this.f.category_id.value,
            role: this.f.role.value,
            email: this.f.email.value,
            password: this.f.password.value,
            password_confirmation: this.f.password_confirmation.value,
            created_by: JSON.parse(localStorage.getItem('currentUser')).user.id
        }

        this.loading = true;
        this.userService.createUser(reqBody)
            .pipe(first())
            .subscribe({
                next: () => {
                    localStorage.setItem('response', JSON.stringify({type: 'success', message: 'Item created with success!'}));
                    this.router.navigate(['/users']);

                    // get all employees and add them to employees observable
                    this.userService.getAllEmployees().subscribe(employees => {
                        this.userService.setEmployeesObs(employees);
                    })
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}
