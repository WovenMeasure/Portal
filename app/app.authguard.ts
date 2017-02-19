import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, Params, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContextService } from './common/services/context-service';


@Injectable()
export class CanActivateGuard implements CanActivate {

    constructor(private contextService: ContextService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (this.contextService.LoggedIn) {
            return true;
        }

        this.router.navigate(['/login'], { queryParams: route.queryParams });
        return false;
    }
}

