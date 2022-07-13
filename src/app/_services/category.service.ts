import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CategoryService {
    constructor(private http: HttpClient) { }

    private categoriesObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getCategoriesObs(): Observable<any> {
        return this.categoriesObs$.asObservable();
    }

    setCategoriesObs(categories: any) {
        this.categoriesObs$.next(categories);
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/categories/get/all`);
    }

    getCategoriesAllDeleted() {
        return this.http.get(`${environment.apiUrl}/categories/get/all/deleted`);
    }

    getCategoryById(id) {
        return this.http.get(`${environment.apiUrl}/categories/get/` + id);
    }

    delete(id, deleted_by){
        return this.http.delete(`${environment.apiUrl}/categories/delete/` + id + '/' + deleted_by);
    }

    create(name: string, created_by: any) {
        return this.http.post(`${environment.apiUrl}/categories/create`, { name, created_by })
            .pipe(map(category => {
                // do something

            }));
    }

    update(id: string, name: string, updated_by: any) {
        return this.http.put<any>(`${environment.apiUrl}/categories/update/` + id, { name, updated_by })
            .pipe(map(category => {
                // do something

            }));
    }
}