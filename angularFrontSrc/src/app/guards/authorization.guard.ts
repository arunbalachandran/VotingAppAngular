import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authorizationService: AuthorizationService, private router: Router) {

    }

    canActivate() {
        if (this.authorizationService.loggedIn()) {
            return true;
        }

        else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}