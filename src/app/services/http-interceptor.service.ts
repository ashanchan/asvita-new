
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone(
      {
        url: req.url.replace('http://', 'https://'),
        headers: req.headers.set('test-header', 'myvalue')
      }
    )
    console.log('Processed secureReq ', secureReq);
    alert('intercepted');
    return next.handle(secureReq)
  }
}
