import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    editUser(newUser) {
        return this.currentUserSubject.next(newUser);
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    register(name: string, email: string, password: string, password_confirmation: string) {
        return this.http.post<any>(`${environment.apiUrl}/register`, { name, email, password, password_confirmation })
            .pipe(map(user => {
                // do something

            }));
    }

    confirmEmail(token: any){
        return this.http.post(`${environment.apiUrl}/confirm`, token)
            .pipe(map(res => {
                // do something
                return res;
            }));
    }

    resetPassword(reqBody: any){
        return this.http.post(`${environment.apiUrl}/resetpassword`, reqBody)
            .pipe(map(res => {
                // do something
                return res;
            }));
    }

    sendResetPasswordLink(reqBody: any){
        return this.http.post(`${environment.apiUrl}/sendresetpasswordlink`, reqBody)
            .pipe(map(res => {
                // do something
                return res;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}