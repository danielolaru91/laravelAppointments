import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    forgotPasswordForm: FormGroup;
    resetPasswordForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    params: any;
    response: any;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private userService: UserService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            window.location.href="/";
        }
    }

    ngOnInit() {
        // store all params from url to params object
        this.route.queryParams.subscribe(params => {
            this.params = params
        });
        
        // register form
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required]
        });

        var reqBody = {
            token: this.params['token']
        };
        
        if(this.params['confirm'] && this.params['confirm'] == 'true' && this.params['token']){
            this.authenticationService.confirmEmail(reqBody).subscribe(
                data => {
                    this.response = data;
                },
                error => {
                    this.error = error;
                }
            )
        }
    
    }

    get f() {
        return this.registerForm.controls
    }

    onSubmitRegisterForm() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.f.name.value, this.f.email.value, this.f.password.value, this.f.password_confirmation.value).subscribe(
            data => {
                this.response = {type: 'success', message: "Account created successfully, please check your email and click the verification link!"}
                this.loading = false;
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
   
}
