import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { CategoryService } from '@app/_services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'categories-create.component.html' })
export class CategoriesCreateComponent implements OnInit {

    createForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    loggedUserId = JSON.parse(localStorage.getItem('currentUser')).user.id;

    constructor(
        private formBuilder: FormBuilder,
        private categoryService: CategoryService,
        private router: Router
    ) { 
 
    }

    ngOnInit() {
        this.createForm = this.formBuilder.group({
            name: ['', Validators.required],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.createForm.controls; }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.createForm.invalid) {
            return;
        }

        this.loading = true;
        this.categoryService.create(this.f.name.value, this.loggedUserId).subscribe(
            response => {
                localStorage.setItem('response', JSON.stringify({type: 'success', message: 'Category created with success!'}));
                this.router.navigate(['/categories']);

                // get all categories and add them to categories observable
                this.categoryService.getAll().subscribe(categories => {
                    this.categoryService.setCategoriesObs(categories);
                })
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
}
