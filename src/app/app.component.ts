import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from './services/http.service';
import { HttpRequest } from './models/http-request';
import { HttpResponse } from './models/http-response';
import { DataService } from './services/data.service';
import { MessageService } from './services/message.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//==============================================================================
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private httpServiceSubscription;
  private currentEvent: string = '';
  //==============================================================================
  constructor(private httpService: HttpService, private dataService: DataService, private messageService: MessageService) { }
  //==============================================================================
  public ngOnInit(): void {
    this.dataService.setServerPath('http://localhost:1616/');
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
  }
  //==============================================================================
  public ngOnDestroy(): void {
  }
  //==============================================================================
  private onMessageReceived(event): void {
    this.currentEvent = event.event;
    switch (this.currentEvent) {
      case 'onLoginSubmit':
      case 'onLoginForgotSubmit':
      case 'onLoginRegisterSubmit':
      case 'onGetUserProfile':
      case 'onGetPrescription':
      case 'onGetSubscription':
      case 'onGetConnection':
      case 'onProfileSubmit':
      case 'onPrescriptionSubmit':
        //   alert('listening '+this.currentEvent);
        this.makeHttpRequest(event)
        break;
    }
  }
  //==============================================================================
  private makeHttpRequest(httpRequest: HttpRequest): void {
    this.httpServiceSubscription = this.httpService.getApiData(httpRequest)
      .subscribe(
      data => {
        this.onHttpResponse(data.response, true)
      },
      err => {
        this.onHttpResponse(err, false)
      }
      )
  }
  //==============================================================================
  private onHttpResponse(data, success) {
    let responseData: HttpResponse = new HttpResponse();
    responseData.event = this.currentEvent + 'Response';
    // alert('emitting '+responseData.event);
    if (success) {
      responseData.responseCode = data.responseCode;
      responseData.responseData = data.data;
      responseData.success = data.success;
    }
    else {
      responseData.responseCode = 400;
      responseData.responseData = {message:'Error Connecting to Server'};
      responseData.success = false;
    }
    this.messageService.sendMessage(responseData);
    // this.httpServiceSubscription.unsubscribe();
  }
  //==============================================================================
  //==============================================================================


}
