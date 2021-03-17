import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from './services/user.service';
import {Observable} from 'rxjs';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(private authService: UserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().then(response => {
      if (!response) {
        this.router.navigate(['/login']);
      } else {
        return true;
      }
    });


  }


}
