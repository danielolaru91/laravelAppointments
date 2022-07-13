import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Employee } from '@app/_models';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    private employeesObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getEmployeesObs(): Observable<any> {
        return this.employeesObs$.asObservable();
    }

    setEmployeesObs(employees: any) {
        this.employeesObs$.next(employees);
    }

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees/get/all`);
    }

    getEmployeesAllDeleted() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees/get/all/deleted`);
    }

    getEmployee(id){
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees/get/` + id );
    }

    delete(id, deleted_by){
        return this.http.delete<Employee[]>(`${environment.apiUrl}/employees/delete/` + id + '/' + deleted_by);
    }

    create(name: string, category_id: string, created_by:any) {
        return this.http.post<any>(`${environment.apiUrl}/employees/create`, { name, category_id, created_by })
            .pipe(map(employee => {
                // do something

            }));
    }

    update(name: string, category_id: string, id: string, updated_by: any) {
        return this.http.put<any>(`${environment.apiUrl}/employees/update/` + id, { name, category_id, updated_by })
            .pipe(map(employee => {
                // do something

            }));
    }

    getCategory(id){
        return this.http.get(`${environment.apiUrl}/categories/get/` + id );
    }

}