import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Appointment } from '@app/_models';

import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AppointmentService {
    constructor(private http: HttpClient) { }

    // get the events for calendar display
    getAppointmentsAll(){
        return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments/get/all`);
    }

    getAppointmentsAllDeleted(){
        return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments/get/all/deleted`);
    }

    // get the events for calendar display
    getAppointmentsByEmployee(id: string){
        return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments/employee/` + id);
    }

    // create appointment
    create(employee_id: string, title: string, start: string, end: string, created_by: string) {
        return this.http.post<any>(`${environment.apiUrl}/appointments/create`, { employee_id, title, start, end, created_by })
            .pipe(map(employee => {
                // do something

            }));
    }

    // update appointment
    update(eventId: string, employeeId: string, title: string, start: string, end: string, updated_by: string) {
        return this.http.post<any>(`${environment.apiUrl}/appointments/update`, { eventId, employeeId, title, start, end, updated_by })
            .pipe(map(employee => {
                // do something

            }));
    }

    // delete appointment
    delete(id, deleted_by: any){
        return this.http.delete<Appointment[]>(`${environment.apiUrl}/appointments/delete/` + id + '/' + deleted_by);
    }

    // delete older than 30days appointments to cleanup database
    deleteOld(){
        return this.http.post<Appointment[]>(`${environment.apiUrl}/appointments/delete/old`, {});
    }

}
