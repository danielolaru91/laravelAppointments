import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CategoryService } from '@app/_services';

@Component({ templateUrl: 'categories-update.component.html' })
export class CategoriesUpdateComponent implements OnInit {
    updateForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    category:any;
    categoryId = this.router.url.split('?')[0].split('/').pop();

    loggedUserId = JSON.parse(localStorage.getItem('currentUser')).user.id;

    constructor(
        private formBuilder: FormBuilder,
        private categoryService: CategoryService,
        private router : Router
    ) { 
 
    }

    ngOnInit() {

        this.loading = true;

        this.updateForm = this.formBuilder.group({
            name: ['', Validators.required],
        });

        this.categoryService.getCategoryById(this.categoryId).pipe(first()).subscribe(category => {
            this.loading = false;
            this.category = category[0];
            console.log(this.category);

            this.updateForm.setValue({
                name: this.category.name,
            });

            this.loading = false;

        });


    }

    // convenience getter for easy access to form fields
    get f() { return this.updateForm.controls; }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.updateForm.invalid) {
            return;
        }

        this.loading = true;
        this.categoryService.update(this.categoryId, this.f.name.value, this.loggedUserId)
            .pipe(first())
            .subscribe({
                next: () => {
                    localStorage.setItem('response', JSON.stringify({type: 'success', message: 'Categorie editata cu success!'}));
                    this.router.navigate(['/categories']);
                    
                    // get all categories and add them to categories observable
                    this.categoryService.getAll().subscribe(categories => {
                        this.categoryService.setCategoriesObs(categories);
                    });
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}
