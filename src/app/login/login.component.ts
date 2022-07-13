import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
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

        // login form
        if(!this.params['forgot-password'] || this.params['forgot-password'] != 'true'){
            this.loginForm = this.formBuilder.group({
                email: ['', Validators.required],
                password: ['', Validators.required]
            });
        }

        
        // forgot password form
        if(this.params['forgot-password'] == 'true' && !this.params['token']){
            this.forgotPasswordForm = this.formBuilder.group({
                email: ['', Validators.required],
            });
        }
  
        // reset password form
        if(this.params['forgot-password'] == 'true' && this.params['token'] ){

            this.resetPasswordForm = this.formBuilder.group({
                newpassword: ['', Validators.required],
                repeatpassword: ['', Validators.required],
            });

            let reqBody = {
                newpassword: this.resetPasswordForm.controls.newpassword.value,
                repeatpassword: this.resetPasswordForm.controls.repeatpassword.value,
                token: this.params['token']
            }
  
            this.authenticationService.resetPassword(reqBody).subscribe(
            data => {
                this.response = data;
            },
            error => {
                this.error = error;
            }
            
            );
  
        }
        
        window.addEventListener("beforeunload", function (e) {
            localStorage.removeItem('response');
        });

    }

    get f() {
        if(!this.params['forgot-password'] || this.params['forgot-password'] != 'true'){
            return this.loginForm.controls
        }

        if(this.params['forgot-password'] == 'true' && !this.params['token']){
            return this.forgotPasswordForm.controls
        }

        if(this.params['forgot-password'] == 'true' && this.params['token'] ){
            return this.resetPasswordForm.controls
        }
    }

    onSubmitLoginForm() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value).subscribe(
            res => {
                window.location.href="/";
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    onSubmitForgotPassword(){

        this.submitted = true;

        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        let reqBody = {
            email: this.f.email.value,
        }

        this.loading = true;
        this.authenticationService.sendResetPasswordLink(reqBody).subscribe(
        data => {
            this.response = data;
            this.loading = false;
        },
        error => {
            this.error = error;
            this.loading = false;
        }
        );

    }

    onSubmitResetPassword(){

        this.submitted = true;

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        let reqBody = {
            newpassword: this.f.newpassword.value,
            newpassword_confirmation: this.f.repeatpassword.value,
            token: this.params['token']
        }

        this.loading = true;

        this.authenticationService.resetPassword(reqBody).subscribe(
            data => {

                this.response = data;
                this.loading = false;

                console.log('here', this.response);

                if(this.response.type=="success"){
                    setTimeout(() => {
                        window.location.href="/login"
                    }, 1000 )
                }
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );

    }
   
}
