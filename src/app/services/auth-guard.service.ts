import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from './../services/data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate() {
    if (this.dataService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['login/login']);
    return false;
  }
}