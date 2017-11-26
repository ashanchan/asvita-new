import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './../services/data.service';
import { HttpRequest } from '../models/http-request';
import { HttpResponse } from '../models/http-response';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {
  //============================================================================== 
  constructor(public http: Http, private httpClient: HttpClient, public dataService: DataService) { }
  //============================================================================== 
  public getApiData(httpRequest: HttpRequest) {
    let headers = new Headers();
    if (httpRequest.validate) {
      headers.append('x-access-token', this.dataService.getToken());
    }
    else {
      headers.append('x-access-token', '@$V!TA-#~ANMACH');
    }

    let requestOptions = new RequestOptions({
      method: 'post',
      url: this.dataService.getServerPath() + 'manager/' + httpRequest.formData['urlExtn'],
      headers: headers,
      body: JSON.stringify(httpRequest.formData)
    })
    //alert("call made to url "+requestOptions.url);
    try {
      return this.http.request(new Request(requestOptions))
        .map((res: Response) => res.json())
        .catch((err) => {
          return Observable.throw(err)
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  //============================================================================== 
}
