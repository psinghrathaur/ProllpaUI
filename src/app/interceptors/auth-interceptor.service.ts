import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthServiceService } from '../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthServiceService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwtToken');
    const sessionToken = sessionStorage.getItem('jwtToken'); 
    if (token && sessionToken && token !== sessionToken) {
      alert("Session expired due to login from another tab.");
      this.authService.logout(); 
      this.router.navigate(['']); // Redirect to login
      return throwError(() => new Error("Multiple login detected"));
    }

    let authReq = req; // Clone request before modifying headers
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401: // Unauthorized - Token expired or invalid
            this.authService.logout();
            this.router.navigate(['']); // Redirect to login
            break;
          case 403: // Forbidden - Possible session issue
            alert("Session expired. Clear cache and login again.");
            this.authService.logout();
            this.router.navigate(['']);
            break;
          case 404: // Not Found - API does not exist
            alert("Requested resource not found!");
            break;
          case 500: // Internal Server Error
            alert("Internal server error. Try again later.");
            break;
          case 501: // Server connection lost
            alert("Server connection lost. Please check your network.");
            break;
          default:
            alert(`Error: ${error.status} - ${error.message}`);
            break;
        }
        return throwError(() => error);
      })
    );
  }
}
