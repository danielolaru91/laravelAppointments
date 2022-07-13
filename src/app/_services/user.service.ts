import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    private employeesObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getEmployeesObs(): Observable<any> {
        return this.employeesObs$.asObservable();
    }

    setEmployeesObs(employees: any) {
        this.employeesObs$.next(employees);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/get/all`);
    }

    getAllEmployees() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/get/all/employees`);
    }

    getUsersAllDeleted() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/get/all/deleted`);
    }

    getUserById(id) {
        return this.http.get<User[]>(`${environment.apiUrl}/users/get/` + id);
    }

    createUser(reqBody: any){
        return this.http.post(`${environment.apiUrl}/users/create`, reqBody);
    }

    delete(id, deleted_by){
        return this.http.delete<User[]>(`${environment.apiUrl}/users/delete/` + id + '/' + deleted_by);
    }

    update(id, reqBody){
        return this.http.put<User[]>(`${environment.apiUrl}/users/update/` + id, reqBody);
    }
    
}