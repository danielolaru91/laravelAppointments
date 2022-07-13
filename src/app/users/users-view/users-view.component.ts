import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'users-view.component.html' })
export class UsersViewComponent {
    loading = false;
    users: User[];

    error = '';

    loggedUserId = JSON.parse(localStorage.getItem('currentUser')).user.id;

    response: any;

    deleted:any;

    constructor(
        private userService: UserService,
        private router : Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.loading = true;

        this.route.queryParams
        .subscribe(params => {
          this.deleted = params.deleted;
          if(this.deleted == 'true'){  
            this.users = [];
            this.loading = true;
            this.userService.getUsersAllDeleted().subscribe(users => {
              this.users = users;
              this.loading = false;
            })
          }else{
            this.users = [];
            this.loading = true;
            this.userService.getAll().subscribe(users => {
                this.users = users;
                this.loading = false;
            });
          }
        });
    }

    delete(id){
        if(confirm("Sunteti sigur ?")) {
            this.userService.delete(id, this.loggedUserId).subscribe(
                data => {
                    this.response = {type: 'success', message: 'Item deleted with success!'};
                    
                    this.loading = true;
                    // get all employees and add them to employees observable
                    this.userService.getAllEmployees().subscribe(employees => {
                        this.userService.setEmployeesObs(employees);
                        this.users = employees;
                        this.loading = false;
                    })

                    this.router.navigate(['/users']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                }
            );
        }
    }

    update(id){
        this.router.navigate(['/users/update/' + id])
    }

    getCurrentUserId(){
        return JSON.parse(localStorage.getItem('currentUser'))._id;
    }

    getCurrentUserRole(){
        return JSON.parse(localStorage.getItem('currentUser')).role;
    }

    
}