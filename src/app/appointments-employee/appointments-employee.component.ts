import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Employee } from '@app/_models';
import { UserService } from '@app/_services';
import { AppointmentService } from '@app/_services';
import { NavigationEnd, Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, Calendar } from '@fullcalendar/core';
import allLocales from '@fullcalendar/core/locales-all';
import { filter, first } from 'rxjs/operators';

@Component({ 
  templateUrl: 'appointments-employee.component.html',
}) 
export class AppointmentsEmployeeComponent implements OnInit{ 

    createForm: FormGroup;
    updateForm: FormGroup;

    loading = false;
    submitted = false;

    calendarApi: any;
    calendarOptions: CalendarOptions;

    response: any;
    error = '';

    employee: any;
    employees: Employee[];
    employeeId: any;

    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    loggedUserId = JSON.parse(localStorage.getItem('currentUser')).user.id;

    userId = this.loggedUser.user.id;

    appointments: any;
    Events = [];

    showDateModal: boolean;
    showEventModal: boolean;

    eventId: any;
    eventTitle: any;
    eventDate: any;
    eventStart: any;
    eventEnd: any;
    eventEmployee: any;
    eventCategory: any;
    backgroundColor = '';
    clickedDate: any;

    constructor(
        private userService: UserService,
        private appointmentService : AppointmentService,
        private router : Router,
        private formBuilder: FormBuilder
    ) { 
        
    }

    // references the #calendar in the template used for accessing the api
    @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
    ngOnInit() {

        // need for load calendar bundle first
        forwardRef(() => Calendar);

        // SET loading to true
        this.loading = true;
      
        // delete older than 30 days appointments
        // first check if first day of month if yes proceed
        var d = new Date();
        if(d.getDate() === 1){ 
          this.appointmentService.deleteOld().subscribe();
        }
        
        
        // create formbuilder
        this.createForm = this.formBuilder.group({
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],

        });

        // update formbuilder
        this.updateForm = this.formBuilder.group({
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
        });
        
        // load the calendar
        this.loadCalendar();

        // Handle route change for when switching from one calendar to the other from sidemenu
        this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))  
        .subscribe((event: NavigationEnd) => {

          // reset response
          this.response = '';
          // load calendar
          this.loadCalendar();

        });

      };

      //Event Render Function to display custom html in calendar - not in use - commented in calendar settings
      renderEventContent(eventInfo, createElement) {
        var innerHtml;
        // Store custom html code in variable
        var from = eventInfo.event._def.extendedProps.from;
        var to = eventInfo.event._def.extendedProps.to;
        var title = eventInfo.event._def.extendedProps.title;
        innerHtml = from + ' ' + to + ' ' + title
        //Event with rendering html
        return createElement = { html: '<div>'+innerHtml+'</div>' }
      }
    
      // on click date
      handleDateClick(arg: { dateStr: any; } ) {

        // set calendar api
        this.calendarApi = this.calendarComponent.getApi();

        let dateString = arg.dateStr;
        let dateSplit =  dateString.split("T");

        // clicked date used for adding events
        this.clickedDate = dateSplit[0]; 

        // if clicked date is in dayGridMonth or dayGridWeek, go to day view
        if(arg['view']['type'] == 'dayGridMonth' || arg['view']['type'] == 'dayGridWeek'){
          this.calendarApi.gotoDate(arg['date']);
          this.calendarApi.changeView('timeGridDay');
        }

        // if clicked date is in timeGridDay show modal to create new appointment and store date to localstorage
        if(arg['view']['type'] == 'timeGridDay'){

          // reset form
          this.createForm.reset();

          // reset validation
          Object.keys(this.createForm.controls).forEach(key => {
            this.createForm.get(key).setErrors(null) ;
          });

          this.showDateModal = true;
        }

      }
      
      // on click event show modal and get the data from the arg.event and display it in the modal
      handleEventClick(arg: any) {
        var date = arg.event['_instance'].range.start;
        this.clickedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');

        // set calendar api
        this.calendarApi = this.calendarComponent.getApi();

        // if clicked event is in dayGridMonth or dayGridWeek go to timeGridDay of that date
        if(arg['view']['type'] == 'dayGridMonth' || arg['view']['type'] == 'dayGridWeek'){
          this.calendarApi.gotoDate(formatDate(date, 'yyyy-MM-dd', 'en-US'));
          this.calendarApi.changeView('timeGridDay');
        }

        // if event is clicked in timeGridDay view show modal with details and delete button
        if(arg['view']['type'] == 'timeGridDay'){

          console.log(arg.event);
          this.eventId = arg.event._def.publicId;
          this.eventTitle = arg.event._def.title;
          this.eventEmployee = arg.event._def.extendedProps.employee.name;
          this.eventCategory = arg.event._def.extendedProps.category;
          this.eventDate = formatDate(arg.event['_instance'].range.start, 'yyyy-MM-dd', 'en-US');
          this.eventStart = formatDate(arg.event['_instance'].range.start, 'HH:mm', 'en-US', '+00:00');
          this.eventEnd = formatDate(arg.event['_instance'].range.end, 'HH:mm', 'en-US', '+00:00');
          // update formbuilder
          this.updateForm = this.formBuilder.group({
              title: [this.eventTitle, Validators.required],
              start: [this.eventStart, Validators.required],
              end: [this.eventEnd, Validators.required],
          });
  
          this.showEventModal = true;
        }


      }

      // handle event drag drop
      handleEventDrop(arg: any) {
          console.log('eventdrop', arg.event);

          this.eventId = arg.event._def.publicId;
          this.eventTitle = arg.event._def.title;
          this.eventEmployee = arg.event._def.extendedProps.employee.name;
          this.eventCategory = arg.event._def.extendedProps.category;
          this.eventDate = formatDate(arg.event['_instance'].range.start, 'yyyy-MM-dd', 'en-US');
          this.eventStart = formatDate(arg.event['_instance'].range.start, 'yyyy-MM-dd HH:mm', 'en-US', '+00:00');
          this.eventEnd = formatDate(arg.event['_instance'].range.end, 'yyyy-MM-dd HH:mm', 'en-US', '+00:00');

          this.appointmentService.update(this.eventId, this.employeeId, this.eventTitle, this.eventStart, this.eventEnd, this.userId).subscribe(
              data => {
                this.response = {type: 'success', message: 'Appointment updated successfully!'};
                this.loadCalendar();
              },
              error => {
                  this.error = error;
                  this.loading = false;
              }
          );

          
      }

      handleEventResize(arg: any) {
        console.log(arg.event);

          this.eventId = arg.event._def.publicId;
          this.eventTitle = arg.event._def.title;
          this.eventEmployee = arg.event._def.extendedProps.employee.name;
          this.eventCategory = arg.event._def.extendedProps.category;
          this.eventDate = formatDate(arg.event['_instance'].range.start, 'yyyy-MM-dd', 'en-US');
          this.eventStart = formatDate(arg.event['_instance'].range.start, 'yyyy-MM-dd HH:mm', 'en-US', '+00:00');
          this.eventEnd = formatDate(arg.event['_instance'].range.end, 'yyyy-MM-dd HH:mm', 'en-US', '+00:00');

          this.appointmentService.update(this.eventId, this.employeeId, this.eventTitle, this.eventStart, this.eventEnd, this.userId).subscribe(
              data => {
                this.response = {type: 'success', message: 'Appointment updated successfully!'};
                this.loadCalendar();
              },
              error => {
                  this.error = error;
                  this.loading = false;
              }
          );
      }

      // hide date modal
      hideDateModal()
      {
        this.showDateModal = false;
      }

      // hide event modal
      hideEventModal(){
        this.showEventModal = false;
        this.createForm.reset();
        this.updateForm.reset();
        this.error = '';
      }

      // convenience getter for easy access to form fields
      get f() { return this.createForm.controls; }    
      get ff() { return this.updateForm.controls; }

      // create appointment form
      onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.createForm.invalid) {
            return;
        }

        var start = this.clickedDate + 'T' + this.f.start.value;
        var end = this.clickedDate + 'T' + this.f.end.value;

        this.loading = true;
        this.appointmentService.create(this.employeeId, this.f.title.value, start, end, this.userId).subscribe(
          data => {    
            this.response = {type: 'success', message: 'Appointment created successfully!'};
            this.loadCalendar();      
          },
          error => {
              this.error = error;
              this.loading = false;
          }
        )

    }

    // update appointment form
    onSubmitUpdate() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.updateForm.invalid) {
            return;
        }

        var start = this.clickedDate + 'T' + this.ff.start.value;
        var end = this.clickedDate + 'T' + this.ff.end.value;

        this.loading = true;
        this.appointmentService.update(this.eventId, this.employeeId, this.ff.title.value, start, end, this.userId).subscribe(
            data => {
                this.response = {type: 'success', message: 'Appointment updated successfully!'};
                this.loadCalendar();
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

      getHours() {
          var hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
          return hours;
      }

      delete(id: any, eventDate: any){
        console.log(id,eventDate);
        if(confirm("Sunteti sigur ca doriti sa stergeti programarea ?")) {

          this.loading = true;
          this.appointmentService.delete(id, this.loggedUserId).subscribe(
              data => {
                // set success message
                this.response = {type: 'success', message: 'Appointment deleted successfully!'};
                // load the calendar
                this.loadCalendar();
                this.loading=false;
              },
              error => {
                  this.error = error;
                  this.loading = false;
              }
          );

        }
          
      }

      loadCalendar(){
          // set loading to true
          this.loading = true;

          // reset employee to nothing
          this.employee = [];
          this.Events = [];

          // hide modals
          this.showEventModal = false;
          this.showDateModal = false;

          // get last part of url (the employeeid)
          this.employeeId = this.router.url.split('?')[0].split('/').pop()

          // get employee by category id
          this.userService.getUserById(this.employeeId).subscribe(response => {
              this.employee = response[0];
          });

          // get all the appointments by employeeid and push them to this.Events array for display in the calendar
            this.appointmentService.getAppointmentsByEmployee(this.employeeId).subscribe(appointments => {
              this.appointments = appointments;

              appointments.forEach((item => {
                this.Events.push(item);
              }));

          });

          // load the calendar
          this.calendarOptions = {
            editable: true,
            droppable: true,
            initialView: 'dayGridMonth',
            events: this.Events,
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,timeGridDay',
            },
            //eventContent: this.renderEventContent,
            displayEventEnd: true,
            allDaySlot: false,
            locales: allLocales,
            //calendar language
            locale: 'en',
            slotDuration: '00:30:00',
            slotLabelInterval: '00:30:00',
            slotMinTime: '08:00',
            slotMaxTime: '20:30',
            slotLabelFormat: {  hour: 'numeric',
                                minute: '2-digit',
                                omitZeroMinute: false,
                                meridiem: 'short'
            },
            dateClick: this.handleDateClick.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventDrop: this.handleEventDrop.bind(this),
            eventResize: this.handleEventResize.bind(this)
          } 

          // set loading to false
          this.loading = false;
      }
    
}


 

