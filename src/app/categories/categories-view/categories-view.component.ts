import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@app/_models';
import { CategoryService } from '@app/_services';
declare var $:any;

@Component({ templateUrl: 'categories-view.component.html' })
export class CategoriesViewComponent implements OnInit, AfterViewInit {
    loading = false;
    categories: any;

    error = '';

    response = JSON.parse(localStorage.getItem('response'));

    loggedUserId = JSON.parse(localStorage.getItem('currentUser')).user.id;

    deleted:any;

    constructor(
        private categoryService: CategoryService,
        private router : Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.loading = true;


        this.route.queryParams
        .subscribe(params => {
          this.deleted = params.deleted;
          if(this.deleted == 'true'){  
            this.categories = [];
            this.loading = true;
            this.categoryService.getCategoriesAllDeleted().subscribe(categories => {
              this.categories = categories;
              this.loading = false;
            })
          }else{
            this.categories = [];
            this.loading = true;
            this.categoryService.getAll().subscribe(categories => {
                this.loading = false;
                this.categories = categories;
            });
          }
        });

    }

    ngAfterViewInit(){
        localStorage.removeItem('response');
    }

    delete(id){
        if(confirm("Are you sure you want to delete the category ?")) {
            this.categoryService.delete(id, this.loggedUserId).subscribe(
                data => {
                    this.response = {type: 'success', message: 'Categorie stearsa cu success!'};
                    
                    this.loading = true;
                    this.categoryService.getAll().subscribe(categories => {
                        this.loading = false;
                        this.categories = categories;
                        this.categoryService.setCategoriesObs(categories);
                    });

                    this.router.navigate(['/categories'])

                },
                error => {
                    this.error = error;
                    this.loading = false;
                }
            );
        }
    }

    update(id){
        this.router.navigate(['/categories/update/' + id])
    }
 
}
