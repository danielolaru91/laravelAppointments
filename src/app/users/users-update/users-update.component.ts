import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';
import { AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'users-update.component.html' })
export class UsersUpdateComponent implements OnInit {
    updateForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    user: any;
    response: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) { 
 
    }

    ngOnInit() {
        var id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

        this.updateForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
        });

        this.loading = true;
        this.userService.getUserById(id).subscribe(res => {
            this.user = res[0];

            this.updateForm = this.formBuilder.group({
                name: [this.user.name, Validators.required],
                email: [this.user.email, Validators.required],
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

        var reqBody = {
            name: this.f.name.value,
            email: this.f.email.value,
        }

        this.userService.update(this.user.id, reqBody)
            .subscribe( response => {
                this.response = response;
                this.loading = false;
            });
    }
}
