import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // Check authentication
    if (!isAuthenticated) {
      this.router.navigate(['']); // Redirect to login if not authenticated
      return false;
    }
    return true;
  }
}

