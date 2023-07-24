import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = environment.tokenName;

    if (token) {
      // Clone the request and add the token to the headers
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:4200' 
        }
      });
      return next.handle(authRequest);
  }
  else{
    return next.handle(request);
  }

      // Pass the modified request to the next handler

}
}
