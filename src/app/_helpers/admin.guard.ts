import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && JSON.parse(localStorage.getItem('currentUser')).user.role == 'Admin') {
            // logged in as admin so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}